const { EventModel } = require("../../models/EventModel.js");

async function createEvent(eventName, description, eventDate, location, host, attendees){
    try {

        let result = await EventModel.create({
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
        let result = await EventModel.findOne(query);

        return result;
    } catch (error) {
        console.error("Error finding event: ", error);
        throw new Error("Error finding event, please try again.")
    }
}

module.exports = {
    createEvent,
    findOneEvent
}