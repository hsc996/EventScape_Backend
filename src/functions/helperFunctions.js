const bcrypt = require("bcrypt");
const { RSVPModel } = require("../models/RSVPModel");
const { AppError } = require("../functions/errorFunctions.js");

const saltRounds = 10;

//Helper Functions

function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function validatePassword(password){
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}


async function hashPassword(password){
    return await bcrypt.hash(password, saltRounds);
}


async function comparePassword(providedPassword, storedPassword){
    return await bcrypt.compare(providedPassword, storedPassword);
}


async function checkRSVPExistence(eventId, userId){
    try {
        const existingRsvp = await RSVPModel.findOne({ eventId, userId });
        return existingRsvp;
    } catch (error) {
        console.error("Error checking existing RSVP: ", error);
        throw new AppError("Error checking RSVP existence, please try again later.");
    }
}

async function handleRSVPStatus(event, userId, status){
    if (!["yes", "maybe", "no"].includes(status)){
        throw new AppError("Invalid response type. Status must be 'yes', 'maybe' or 'no'.", 400);
    }

    if (event.host.toString() === userId.toString()){
        throw new AppError("The host cannot RSVP to their own event.", 403);
    }

    if (!event.isPublic && !event.invited.includes(userId)){
        throw new AppError("This is a private event.", 403);
    }

    if (event.attendees.includes(userId) && status === "yes") {
        throw new AppError("You have already RSVP'd as 'yes' to this event.", 400);
    }

    if (event.maybe_attending.includes(userId) && status === "maybe") {
        throw new AppError("You have already RSVP'd as 'maybe' to this event.", 400);
    }

    if (event.not_attending.includes(userId) && status === "no") {
        throw new AppError("You have already RSVP'd as 'no' to this event.", 400);
    }

    switch (status) {
        case "yes":
            if (!event.attendees.includes(userId)) {
                event.attendees.push(userId);
            }
            event.not_attending = event.not_attending.filter(user => user.toString() !== userId.toString());
                event.maybe_attending = event.maybe_attending.filter(user => user.toString() !== userId.toString());
            break;
        case "no":
            if (!event.not_attending.includes(userId)) {
                event.not_attending.push(userId);
            }
            event.attendees = event.attendees.filter(user => user.toString() !== userId.toString());
            event.maybe_attending = event.maybe_attending.filter(user => user.toString() !== userId.toString());
            break;
        case "maybe":
            if (!event.maybe_attending.includes(userId)) {
                event.maybe_attending.push(userId);
            }
            event.attendees = event.attendees.filter(user => user.toString() !== userId.toString());
            event.not_attending = event.not_attending.filter(user => user.toString() !== userId.toString());
            break;
            default:
                throw new AppError("Invalid RSVP status.", 400);
        }
}

module.exports = {
    validateEmail,
    validatePassword,
    hashPassword,
    comparePassword,
    checkRSVPExistence,
    handleRSVPStatus
}