const { EventModel } = require("../models/EventModel.js");
const { AppError } = require("../middleware/routerMiddleware.js");

async function updateEventAttendance(eventId, userId, status){
    switch (status) {
        case "yes":
            await EventModel.findByIdAndUpdate( eventId, {
                $addToSet: { attendees: userId },
                $pull: { not_attending: userId, maybe_attending: userId }
            });
            break;
        case "no":
            await EventModel.findByIdAndUpdate( eventId, {
                $addtoSet: { attendees: userId },
                $pull: { not_attending:userId, maybe_attending: userId }
            });
            break;
        case "maybe":
            await EventModel.findByIdAndUpdate( eventId, {
                $addtoSet: { attendees: userId },
                $pull: { not_attending:userId, maybe_attending: userId }
            });
            break;
        default:
            throw new AppError("Invalid response type. Status must be 'yes', 'no' or 'maybe'", 400);
    }
}

module.exports = {
    updateEventAttendance
}