const bcrypt = require("bcrypt");
const { RSVPModel } = require("../models/RSVPModel");

const saltRounds = 10;

//Helper Functions

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}


function handleRouteError(response, error, defaultMessage = "An error occurred") {
    console.error("Error: ", error.message || defaultMessage);

    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            error: error.message,
        });
    }

    return response.status(500).json({
        error: defaultMessage,
    });
}


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
    AppError,
    handleRouteError,
    validateEmail,
    validatePassword,
    hashPassword,
    comparePassword,
    checkRSVPExistence
}