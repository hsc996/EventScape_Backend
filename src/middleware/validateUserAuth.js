const { decodeJWT } = require('../functions/jwtFunctions');

async function validateUserAuth(request, response, next){
    const providedToken = request.headers.authorization && request.headers.authorization.split(' ')[1];
    console.log(providedToken);

    if (!providedToken){
        return response.status(403).json({
            message: "Please sign in to view this content."
        });
    }

    const decodedData = decodeJWT(providedToken);
    console.log("Decoded data: ", decodedData);

    if (decodedData && decodedData.userId){
        request.authUserData = decodedData;
        return next();
    } else {
        return response.status(403).json({
            message: "Please sign in to view this content.",
        });
    }
}

module.exports = {
    validateUserAuth
}