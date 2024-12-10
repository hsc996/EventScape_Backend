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
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/helperFunctions.js");

const router = express.Router();

const saltRounds = 10;


// Register new account route

router.post(
    "/signup",
    handleRoute(async (request, response) => {
        const { username, password, email } = request.body;

        // Check for missing fields
        if (!username || !password || !email) {
            throw new AppError("Incorrect or missing sign-up credentials provided.", 400);
        }

        // Validate email format
        if (!validateEmail(email)) {
            throw new AppError("Invalid email format.", 400);
        }

        // Validate password strength
        if (!validatePassword(password)) {
            throw new AppError(
                "Password must be at least 8 characters and include at least one letter, one number, and one special character.",
                400
            );
        }

        // Check if email or username already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new AppError("This email is already registered.", 400);
            }
            if (existingUser.username === username) {
                throw new AppError("This username has already been taken. Please choose another.", 400);
            }
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the new user
        let newUser = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        console.log(`User created successfully: ${newUser.username} (${newUser.email})`);

        let newJwt = generateJWT(newUser._id, newUser.username, newUser.isAdmin);

        sendSuccessResponse(response, "User registered successfully.", {
            jwt: newJwt,
            user: {
                id: newUser._id,
                username: newUser.username
            }
        });
    })
);




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