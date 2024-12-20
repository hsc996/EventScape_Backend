const { RSVPModel } = require("../../models/RSVPModel.js");
const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/errorFunctions.js");
const { handleRSVPStatus } = require("../../functions/helperFunctions.js");


// Post a yes/no/maybe RSVP on an event

async function createRSVP(data){
    try {
        const { eventId, userId, status } = data;

        if (!["yes", "maybe", "no"].includes(status)){
            throw new AppError("Invalid response type. Status must be 'yes', 'maybe' or 'no'.", 400);
        }

        const event = await EventModel.findById(eventId);

        await handleRSVPStatus(event, userId, status);

        const newRSVP = await RSVPModel.create(data);

        await event.save();

        return newRSVP;
    } catch (error) {
        console.error("Error posting RSVP response: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error posting RSVP response, please try again later.", 500);
    }
}


// Updating an RSVP response on an event

async function updateRSVP(query, updatedData){
    try {
        const { eventId, userId, status } = updatedData;
        console.log("Received status in updateRSVP:", updatedData.status);
        console.log("Status received in request:", status);

        if (!status) {
            throw new AppError("Status is required.", 400);
        }

        const rsvp = await RSVPModel.findOneAndUpdate(
            { eventId: eventId, userId: userId },
            { $set: updatedData },
            { new: true, runValidators: true }
          ).catch(error => {
            console.log("Mongoose update error:", error);  // Log error details
            throw new Error('Error updating RSVP status');
          });

        const event = await EventModel.findById(eventId);
        if (!event){
            throw new AppError("Event not found.", 404);
        }

        await handleRSVPStatus(event, userId, status);

        await event.save();

        return rsvp;
    } catch (error) {
        console.error("Error updating RSVP response: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error updating RSVP status, please try again later.", 500);
    }
}


// Delete an RSVP response to an event

async function deleteRSVP(query){
    try {
        const result = await RSVPModel.deleteOne(query);

        return result;
    } catch (error) {
        console.error("Error deleting RSVP status: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error deleting RSVP status, please try again later.", 500);
    }
}


// Find all list -- for yes/no/maybe

async function findRSVPsByResponse(query) {
    console.log("Finding RSVPs with query:", query);
    try {
        const result = await RSVPModel.find(query)
            .populate("eventId")
            .populate("userId");

        console.log("RSVPs found:", result);
        return result;
    } catch (error) {
        console.error("Error retrieving RSVP list: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error retrieving RSVP list, please try again later.", 500);
    }
}


module.exports = {
    createRSVP,
    updateRSVP,
    deleteRSVP,
    findRSVPsByResponse
}