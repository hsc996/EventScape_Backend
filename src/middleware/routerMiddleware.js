// Router middleware
const { EventModel, UserModel } = require("../models/EventModel.js");

const { sendError } = require("../functions/helperFunctions");

class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

function handleRouteError(response, error, defaultMessage){
    console.error(error.message);
    if (error instanceof AppError){
        return response.status(error.statusCode).json({
            message: error.message
        });
    }
    return sendError(response, 500, defaultMessage || "Something went wrong, please try again later.");
}

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
        console.error("Authorisation errror: ", error);
        return response.status(500).json({
            error: "Internal Server error."
        })
    }
}


module.exports = {
    handleRoute,
    sendSuccessResponse,
    AppError,
    handleRouteError,
    checkEventPermission
}