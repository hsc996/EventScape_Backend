const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

function generateJWT(userId, username, roles = null){
    return jwt.sign(
        {
            userId: userId,
            username:username,
            roles: roles
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
        throw new Error("Invalid or expired token.")
    }
}

module.exports = {
    generateJWT,
    decodeJWT
}