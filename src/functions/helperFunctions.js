const bcrypt = require("bcrypt");
const { RSVPModel } = require("../models/RSVPModel");

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


module.exports = {
    validateEmail,
    validatePassword,
    hashPassword,
    comparePassword,
    checkRSVPExistence
}