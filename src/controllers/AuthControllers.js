const express = require("express");
const { UserModel } = require("../models/UserModel.js");
const { generateJWT } = require("../functions/jwtFunctions.js");
const {
    sendError,
    validateEmail,
    validatePassword,
    hashPassword,
    comparePassword
} = require("../functions/helperFunctions.js");

const router = express.Router();

const saltRounds = 10;


// Register new account route

router.post("/signup", async (request, response) => {
    try {
        const { username, password, email } = request.body;
    
        if (!username || !password || !email){
            return sendError(response, 400, "Incorrect or missing sign-up credentials provided.");
        }

        if (!validateEmail(email)){
            return sendError(response, 400, "Invalid email format.");
        }

        if (!validatePassword(password)){
            return sendError(response, 400, "Password must be at least 8 characters and include at least one letter, one number, and one special character.");
        }

        const hashedPassword = await hashPassword(password);
    
        let newUser = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        console.log(`User created successfully: ${newUser.username} (${newUser.email})`);
    
        let newJwt = generateJWT(newUser._id, newUser.username, newUser.isAdmin);
    
        response.status(200).json({
            jwt: newJwt,
            user: {
                id: newUser._id,
                username: newUser.username
            }
        });

    } catch (error) {
        console.error("Server Error: ", error);
        sendError(response, 500, "Internal Server Error.");
    }
});



// Sign in existing account
router.post("/signin", async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password){
            return sendError(response, 400, "Incorrect or missing sign-in credentials provided.");
        }

        if (!validateEmail(email)){
            return sendError(response, 400, "Invalid email format.");
        }

        const user = await UserModel.findOne({
            email: email
        });

        if (!user){
            return sendError(response, 404, "User not found. Please sign up first.");
        }

        const isPasswordValid = await comparePassword(password, user.password);


        if (!isPasswordValid){
            console.log("Invalid password attempt for email:", email); // Log the invalid password attempt
            return sendError(response, 404, "Invalid password.");
        }

        let newJwt = generateJWT(user._id, user.username, user.isAdmin);

        response.status(200).json({
            jwt: newJwt,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Server Error: ", error);
        sendError(response, 500, "Internal Server Error.");
    }
});



module.exports = router;