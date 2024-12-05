// Router middleware

const { sendError } = require("../functions/helperFunctions");

class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
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

async function validateRequiredFields(fields){
    return async function (request, response, next){
        for (const field of fields){
            if (!request.body[field]){
                return response.status(400).json({
                    error: "Bad Request",
                    message: `${field} field is required in the request body.`
                });
            }
        }
    }
    next();
}


module.exports = {
    handleRoute,
    sendSuccessResponse,
    validateRequiredFields, 
    AppError
}