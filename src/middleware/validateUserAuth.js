const { decodeJWT } = require('../functions/jwtFunctions');

async function validateUserAuth(request, response, next){
    let providedToken = request.headers.jwt;
    console.log(providedToken);

    if (!providedToken){
        return response.status(403).json({
            message: "Please sign in to view this content."
        });
    }

    let decodedData = decodeJWT(providedToken);
    console.log(decodedData);
    if (decodedData.userId){
        request.authUserData = decodedData;
        next();
    } else {
        return response.status(403).json({
            message: "Please sign in to view this content."
        });
    }
}

module.exports = {
    validateUserAuth
}