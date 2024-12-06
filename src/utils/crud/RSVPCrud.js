const { RSVPModel } = require("../../models/RSVPModel.js");
const { AppError } = require("../../middleware/routerMiddleware.js");

// Post a yes/no/maybe RSVP on an event
async function createRSVP(data){
    try {
        const result = await RSVPModel.create(data);
        return result;
    } catch (error) {
        console.error("Error posting RSVP response: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error posting RSVP response, please try again.", 500);
    }
}


// Updating an RSVP response on an event
async function updateRSVP(query, updatedData){
    try {
        const result = await RSVPModel.findOneAndUpdate(query, updatedData, { new: true });

        return result;
    } catch (error) {
        console.error("Error updating RSVP response: ", error);
        throw new Error("Error updating RSVP status, please try again.");
    }
}


// Delete an RSVP response to an event
async function deleteRSVP(query){
    try {
        const result = await RSVPModel.deleteOne(query);

        return result;
    } catch (error) {
        console.error("Error deleting RSVP status: ", error);
        throw new Error("Error deleting RSVP status, please try again.");
    }
}


// Find all list -- for yes/no/maybe
async function findRSVPsByResponse(eventId, response){
    try {
        const result = await RSVPModel.find({ eventId, response })
            .populate("eventId")
            .populate("userId");
        return result;
    } catch (error) {
        console.error("Error retrieving RSVP list.");
        throw new Error("Error retrieving RSVP list, please try again.")
    }
}


async function findOneRSVP(query){
    try {
        console.log("Executing query in findOneRSVP:", query);
        const result = await RSVPModel.findOne(query);
        if (!result) {
            console.error("No RSVP found for query:", query);
        }
        return result;
    } catch (error) {
        console.error("Database error in findOneRSVP:", error.message);
        throw new Error("Error finding RSVP status, please try again.");
    }
}

module.exports = {
    createRSVP,
    updateRSVP,
    deleteRSVP,
    findRSVPsByResponse,
    findOneRSVP
}