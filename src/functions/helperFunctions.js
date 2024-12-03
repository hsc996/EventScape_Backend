const bcrypt = require("bcrypt");

const saltRounds = 10;

// Helper functions

function sendError(response, status, message){
    return response.status(status).json({ message });
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

module.exports = {
    sendError,
    validateEmail,
    validatePassword,
    hashPassword,
    comparePassword
}