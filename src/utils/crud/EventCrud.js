const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/errorFunctions.js");


async function createEvent(eventName, description, eventDate, location, host, invited, theme){
    try {

        const result = await EventModel.create({
            eventName: eventName,
            description: description,
            eventDate: eventDate,
            location: location,
            host: host,
            invited: invited || [],
            theme: theme
        });

        return result;

    } catch (error) {
        console.error("Error creating event: ", error.message);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Internal server error: Unable to create event. Please try again later.", 500);
    }
}


async function findOneEvent(query){
    try {
        const result = await EventModel.findOne(query);

        return result;
    } catch (error) {
        console.error("Error finding event: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Internal server error: Error finding event, please try again.", 500)
    }
}

async function findActiveEventsForUser(userId){
    if (!userId){
        throw new AppError("User ID must be provided", 400);
    }
    try {
        const events = await EventModel.find({
            isActive: true,
            invited: { $in: [userId] },
            isPublic: true
        });

        if (!events || events.length === 0) {
            throw new AppError("No active public or invited events found.", 404);
        }

        return events;

    } catch (error) {
        console.error("Error finding active events for user: ", error.message);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error finding active events, please try again.");
    }
}

async function findAllHostEvents(userId){
    if (!userId){
        throw new AppError("User ID must be provided.", 400);
    }

    try {
        const events = await EventModel.find({
            host: userId,
            isActive: true
        });

        if (!events || events.length === 0){
            throw new AppError("This user is not currently hosting any events.", 404);
        }

        return events;
    } catch (error) {
        console.error("Error finding active events hosted by this user: ", error.message);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error finding active events hosted by this user, please try again.");
    }
}


async function findPrivateEvent(eventId, userId) {
    if (!eventId || !userId) {
        throw new AppError("Event ID and User ID must be provided", 400);
    }

    try {

        const event = await EventModel.findOne({
            _id: eventId,
            $or: [
                { attendees: userId },
                { invited: userId }
            ]
        });

        if (!event) {
            throw new AppError("You are not authorized to view this event.", 404);
        }

        return event;

    } catch (error) {
        console.error("Error finding private event: ", error.message);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error retrieving event, please try again later.", 500);
    }
}




async function updateOneEvent(query, updatedData){
    if (!query || !updatedData){
        throw new AppError("Query and update data must be provided.", 400);
    }
    try {
        const result = await EventModel.findOneAndUpdate(query, updatedData, { new: true });

        if (!result){
            throw new AppError("Event not found or could not be updated.", 404);
        }

        return result;

    } catch (error) {
        console.error("Error updating event information: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new Error("Error updating event, please try again.")
    }
}


async function deleteOneEvent(query){
    if (!query){
        throw new AppError("Query must be provided to delete the event.", 400);
    }

    try {
        const result = await EventModel.deleteOne(query);

        if (result.deletedCount === 0){
            throw new AppError("Event not found or could not be deleted.", 404);
        }

        return result;

    } catch (error) {
        console.error("Error deleting event page: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new Error("Error deleting event page, please try again.");
    }
}

module.exports = {
    createEvent,
    findOneEvent,
    updateOneEvent,
    deleteOneEvent,
    findActiveEventsForUser,
    findPrivateEvent,
    findAllHostEvents
}