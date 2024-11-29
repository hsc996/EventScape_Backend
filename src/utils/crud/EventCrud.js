const { EventModel } = require("../../models/EventModel.js");

async function createEvent(eventName, description, eventDate, location, host, attendees){
    try {

        const result = await EventModel.create({
            eventName: eventName,
            description: description,
            eventDate: eventDate,
            location: location,
            host: host,
            attendees: attendees
        });

        return result;

    } catch (error) {
        
        console.error("Error creating event: ", error);
        throw new Error("Error creating event, please try again.");
    }
}


async function findOneEvent(query){
    try {
        const result = await EventModel.findOne(query);

        return result;
    } catch (error) {
        console.error("Error finding event: ", error);
        throw new Error("Error finding event, please try again.")
    }
}

async function findActiveEventsForUser(userId){
    try {

        const events = await EventModel.find({
            attendees: userId,
            isActive: true
        });

        return events;

    } catch (error) {
        console.error("Error finding active events for user: ", error);
        throw new Error("Error finding active events, please try again.");
    }
}

async function updateOneEvent(query, updateData){
    try {
        const result = await EventModel.findOneAndUpdate(query, updateData, { new: true });

        return result;
    } catch (error) {
        console.error("Error updating event information: ", error);
        throw new Error("Error updating event, please try again.")
    }
}


async function deleteOneEvent(query){
    try {
        const result = await EventModel.deleteOne(query);

        return result;
    } catch (error) {
        console.error("Error deleting event page: ", error);
        throw new Error("Error deleting event page, please try again.");
    }
}

module.exports = {
    createEvent,
    findOneEvent,
    updateOneEvent,
    deleteOneEvent,
    findActiveEventsForUser
}