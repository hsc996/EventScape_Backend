const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/errorFunctions.js");


async function createEvent(eventName, description, eventDate, location, host, invited){
    try {
        const result = await EventModel.create({
            eventName: eventName,
            description: description,
            eventDate: eventDate,
            location: location,
            host: host,
            invited: invited
        });

        if (!eventName || !description || !eventDate || !location || !host || !invited){
            return response.status(400).json({
                message: "Please complete all of the required fields."
            });
        }

        if (new Date(eventDate) <= new Date()) {
            return response.status(400).json({
                message: "Event date must be in the future."
            });
        }

        if (location.trim().length < 3) {
            return response.status(400).json({
                message: "Location must be at least 3 characters long."
            });
        }

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
            attendees: userId,
            isActive: true
        });

        if (!events || events.length === 0){
            throw new AppError("No active events found for the given user.", 404);
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
    findPrivateEvent
}