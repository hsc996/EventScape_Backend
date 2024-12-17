const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/errorFunctions.js");


async function findPublicEvents(query) {
    try {

        const result = await EventModel.find({
            $text: { $search: query },
            isPublic: true
        });

        if (result.length === 0) {
            return { message: "No public events matching this description." };
        }

        return result;
    } catch (error) {
        console.error("Error during search:", error.message);
        console.error("Stack trace:", error.stack);

        throw new AppError("An error occurred: Unable to complete search at this time.");
    }
}


async function findPrivateEvents(query, userId){
    try {
        return await EventModel.find({
            $text: { $search: query },
            isPublic: false,
            invited: userId
        })
    } catch (error) {
        throw new AppError("An error occurred: Unable to complete search at this time.");
    }
}

module.exports = {
    findPublicEvents,
    findPrivateEvents
}