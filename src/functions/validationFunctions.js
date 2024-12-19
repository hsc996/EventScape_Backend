const { isValidObjectId } = require("mongoose");
const { AppError } = require("../functions/errorFunctions");


function validateEventData({ eventName, description, eventDate, location, host, invited }) {
    if (!eventName || !description || !eventDate || !location || !host) {
        throw new AppError("Please complete all of the required fields.", 400);
    }

    if (!eventName.trim() || !description.trim()) {
        throw new AppError("Event name and description cannot be empty.", 400);
    }

    if (eventName.length > 100 || description.length > 1000) {
        throw new AppError("Event name or description exceeds the character limit.", 400);
    }

    if (new Date(eventDate) <= new Date()) {
        throw new AppError("Event date must be in the future.", 400);
    }

    if (location.trim().length < 3) {
        throw new AppError("Location must be at least 3 characters long.", 400);
    }

    if (invited !== undefined && invited !== null) {
        console.log("Invited:", invited, "Type:", typeof invited);
        console.log("Is Array:", Array.isArray(invited));
        if (!Array.isArray(invited) || invited.some(id => !isValidObjectId(id))) {
            throw new AppError("Invited users must be a valid list of user IDs.", 400);
        }
    }
}


module.exports = {
    validateEventData
}