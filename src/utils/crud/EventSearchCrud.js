const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/helperFunctions");


async function findPublicEvents(query){
    try {
        return await EventModel.find({
            $text: { $search: query },
            isPublic: true
        })
    } catch (error) {
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