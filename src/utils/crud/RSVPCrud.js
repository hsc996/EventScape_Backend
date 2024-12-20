const { RSVPModel } = require("../../models/RSVPModel.js");
const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/errorFunctions.js");


// Post a yes/no/maybe RSVP on an event

async function createRSVP(data){
    try {
        const { eventId, userId, status } = data;

        if (!["yes", "maybe", "no"].includes(status)){
            throw new AppError("Invalid response type. Status must be 'yes', 'maybe' or 'no'.", 400);
        }

        const newRSVP = await RSVPModel.create(data);

        const event = await EventModel.findById(eventId);

        if (!event){
            throw new AppError("Event not found.", 404);
        }

        if (event.host.toString() === userId.toString()){
            throw new AppError("The host cannot RSVP to their own event.", 403);
        }

        if (!event.isPublic && !event.invited.includes(userId)){
            throw new AppError("This is a private event.", 403);
        }

        switch (status) {
            case "yes":
                event.attendees.push(userId);
                break;
            case "no":
                event.attendees.push(userId);
            case "maybe":
                event.attendees.push(userId);
                break;
            default:
                throw new AppError("Invalid RSVP status.", 400);
        }

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

        if (!["yes", "maybe", "no"].includes(status)){
            throw new AppError("Invalid response type. Status must be 'yes', 'maybe' or 'no'.", 400);
        }

        const rsvp = await RSVPModel.findOneAndUpdate(query, updatedData, { new: true });

        if (!rsvp){
            throw new AppError("RSVP not found.", 404)
        }

        const event = await EventModel.findById(eventId);

        if (!event){
            throw new AppError("Event not found.", 404);
        }

        if (event.host.toString() === userId.toString()){
            throw new AppError("The host cannot RSVP to their own event.", 403);
        }

        if (!event.isPublic && !event.invited.includes(userId)){
            throw new AppError("This is a private event.", 403);
        }

        switch (status) {
            case "yes":
                event.attendees.push(userId);
                event.not_attending = event.not_attending.filter(user => user.toString() !== userId.toString());
                event.maybe_attending = event.maybe_attending.filter(user => user.toString() !== userId.toString());
                break;
            case "no":
                event.not_attending.push(userId);
                event.attendees = event.attendees.filter(user => user.toString() !== userId.toString());
                event.maybe_attending = event.maybe_attending.filter(user => user.toString() !== userId.toString());
                break;
            case "maybe":
                event.maybe_attending.push(userId);
                event.attendees = event.attendees.filter(user => user.toString() !== userId.toString());
                event.not_attending = event.not_attending.filter(user => user.toString() !== userId.toString());
                break;
            default:
                throw new AppError("Invalid RSVP status.", 400);
        }

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