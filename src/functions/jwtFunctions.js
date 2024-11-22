const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRETKEY;

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

function decodeJWT(tokenToDecode){
    return jwtverify(tokenToDecode, jwtSecretKey);
}

module.exports = {
    generateJWT,
    decodeJWT
}