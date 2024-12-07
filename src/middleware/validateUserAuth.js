const { decodeJWT } = require('../functions/jwtFunctions');


// Middleware to authenticate user / ensure they are logged in

async function validateUserAuth(request, response, next) {
    const providedToken = request.headers.authorization && request.headers.authorization.split(' ')[1];

    if (!providedToken) {
        return response.status(403).json({
            message: "Please sign in to view this content."
        });
    }

    try {
        const decodedData = decodeJWT(providedToken, process.env.JWT_SECRET_KEY);
        console.log("Decoded data: ", decodedData);

        if (decodedData && decodedData.userId) {
            request.authUserData = decodedData;
            return next();
        } else {
            return response.status(403).json({
                message: "Please sign in to view this content.",
            });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({
                message: "Your session has expired. Please log in again."
            });
        }

        return response.status(403).json({
            message: "Invalid token. Please sign in to view this content."
        });
    }
}



module.exports = {
    validateUserAuth,
}