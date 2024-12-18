const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/errorFunctions.js");


const findAllPublicEvents = async () => {
    try {
        const events = await EventModel.find({ isPublic: true });

        return events;
    } catch (error) {
        console.error("Error fetching all public events:", error);
        throw new Error("Failed to fetch all public events.");
    }
};


async function searchPublicEvents(query, filters = {}) {
    try {
        const searchQuery = {
            $text: { $search: query },
            isPublic: true
        };

        if (filters.category){
            searchQuery.theme = filters.category;
        }

        const result = await EventModel.find(searchQuery);

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


async function searchPrivateEvents(query, userId, filters = {}){
    try {
        const searchQuery = {
            $text: { $search: query },
            isPublic: false,
            invited: userId
        };

        if (filters.category) {
            searchQuery.theme = filters.category;
        }

        const result = await EventModel.find(searchQuery);

        if (result.length === 0) {
            return { message: "No private events matching this description." };
        }

        return result;

    } catch (error) {
        throw new AppError("An error occurred: Unable to complete search at this time.");
    }
}

module.exports = {
    findAllPublicEvents,
    searchPublicEvents,
    searchPrivateEvents
}