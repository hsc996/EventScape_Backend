const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

function generateJWT(userId, username, isAdmin = false){
    return jwt.sign(
        {
            userId: userId,
            username:username,
            isAdmin: isAdmin
        },
        jwtSecretKey,
        {
            expiresIn: "7d"
        }
    );
}

function decodeJWT(tokenToDecode) {
    try {
        return jwt.verify(tokenToDecode, jwtSecretKey);
    } catch (error) {
        console.error("JWT verification failed:", error);

        if (error.name === 'TokenExpiredError'){
            throw new Error("Token has expired.");
        }
        throw new Error("Invalid or expired token.");
    }
}

module.exports = {
    generateJWT,
    decodeJWT
}