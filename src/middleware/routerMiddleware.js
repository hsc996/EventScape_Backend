// Router middleware
const { EventModel } = require("../models/EventModel.js");
const { RSVPModel } = require("../models/RSVPModel.js");

function handleRoute(routeHandler){
    return async function (request, response, next){
        try {
            await routeHandler(request, response, next);
        } catch (error) {
            console.error("An error occurred: ", error);
            
            if (error instanceof AppError){
                return sendError(response, error.statusCode, error.message);
            }

            return sendError(response, statusCode, error.message);
        }
    }
}

async function sendSuccessResponse(response, message, data = null){
    response.status(200).json({
        message,
        data
    });
}


async function checkEventPermission(request, response, next){
    try {
        const user = request.authUserData;
        const { eventId }  = request.params;

        if (!user){
            return response.status(401).json({
                error: "You are not authorised to perform this action."
            });
        }

        const event = await EventModel.findById(eventId);
        console.log("Event Data: ", event);

        if (!event) {
            return response.status(404).json({
                error: "Event not found"
            });
        }

        if (!user.userId || !event.host) {
            return response.status(400).json({
                error: "Invalid user or event data."
            });
        }

        if (user.isAdmin === true || event.host.toString() === user.userId.toString()){
            return next();
        }

        return response.status(403).json({
            error: "Access denied. You must be admin or the event host to perform this action."
        });
    } catch (error) {
        console.error("Authorisation error: ", error);
        return response.status(500).json({
            error: "Internal Server error."
        })
    }
}

async function checkRsvpPermission(request, response, next) {
    try {
        const user = request.authUserData;
        const { rsvpId } = request.params;

        if (!user) {
            console.log("User not authenticated.");
            return response.status(401).json({
                error: "You are not authorised to perform this action."
            });
        }

        const rsvp = await RSVPModel.findById(rsvpId);
        console.log("RSVP Data: ", rsvp);
        console.log("Authenticated User: ", user);

        if (!rsvp) {
            console.log("RSVP not found.");
            return response.status(404).json({
                error: "RSVP not found."
            });
        }

        if (user.isAdmin === true) {
            console.log("Admin access granted.");
            return next();
        }

        if (rsvp.userId.toString() === user.userId.toString()) {
            console.log("User is RSVP owner. Access granted.");
            return next();
        }

        console.log("Access denied. User is not admin or RSVP owner.");
        return response.status(403).json({
            error: "Access denied. You must be admin or the RSVP owner to perform this action."
        });
    } catch (error) {
        console.error("Authorisation error: ", error);
        return response.status(500).json({
            error: "Internal Server error."
        });
    }
}



module.exports = {
    handleRoute,
    sendSuccessResponse,
    checkEventPermission,
    checkRsvpPermission
}