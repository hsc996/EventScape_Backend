const express = require("express");
const { UserModel } = require("../models/UserModel.js");
const { generateJWT } = require("../functions/jwtFunctions.js");

const router = express.Router();

// Register new account

router.post("/signup", async (request, response) => {
    let username = request.body.username;
    let password = request.body.password;

    if (!username || !password){
        response.status(400).json({
            message: "Incorrect or missing sign-up credentials provided."
        });
    }

    let newUser = await UserModel.create({username: username, password: password})

    let newJwt = generateJWT(newUser.id, newUser.username);

    response.json({
        jwt: newJwt,
        user: {
            id: newUser,
            username: newUser.username
        }
    });
});



// Sign in existing account






module.exports = router;