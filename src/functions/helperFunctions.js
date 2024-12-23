const bcrypt = require("bcrypt");
const { RSVPModel } = require("../models/RSVPModel");
const { AppError } = require("../functions/errorFunctions.js");

const saltRounds = 10;

//Helper Functions


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
}

async function validateFollow(followingId, followerId){
    if (!followerId || !followingId) {
        throw new AppError("Invalid follower or following ID.", 400);
    }

    if (followingId === followerId){
        throw new AppError("You cannot follow or unfollow yourself.", 400);
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    checkRSVPExistence,
    handleRSVPStatus,
    validateFollow
}