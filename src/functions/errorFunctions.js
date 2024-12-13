function sendError(response, statusCode, message) {
    return response.status(statusCode).json({
        success: false,
        message: message
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

module.exports = {
    AppError,
    sendError
}