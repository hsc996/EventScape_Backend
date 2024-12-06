function sendError(response, statusCode, message, detailedMessage = null) {
    response.status(statusCode).json({
        error: message,
        message: detailedMessage || message
    });
}

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

function handleRouteError(response, error, defaultMessage = "An error occurred") {
    const isProduction = process.env.NODE_ENV === 'production';

    console.error(
        "Error",
        isProduction ? "An error occurred, details not exposed." : error.message || defaultMessage
    );

    if (error instanceof AppError) {
        return sendError(response, error.statusCode, error.message);
    }

    return sendError(response, 500, defaultMessage);
}

function handleMongoError(error, response) {
    // Check for the duplicate key error (11000)
    if (error.code === 11000) {
        return sendError(response, 400, "Username already exists, please choose a different one.");
    }

    // If it's another type of error, you can return a generic message or handle other cases
    return sendError(response, 500, "An error occurred, please try again later.");
}

module.exports = {
    sendError,
    AppError,
    handleRouteError,
    handleMongoError
};
