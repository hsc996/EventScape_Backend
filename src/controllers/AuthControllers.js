const express = require("express");
const { UserModel } = require("../models/UserModel.js");
const { generateJWT } = require("../functions/jwtFunctions.js");
const {
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
router.post(
    "/signin",
    handleRoute(async (request, response) => {
        const { email, password } = request.body;

        if (!email || !password) {
            throw new AppError("Incorrect or missing sign-in credentials provided.", 400);
        }

        if (!validateEmail(email)) {
            throw new AppError("Invalid email format.", 400);
        }

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            throw new AppError("User not found. Please sign up first.", 404);
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid password attempt for email:", email); // Log invalid attempts
            throw new AppError("Invalid password.", 401);
        }

        let newJwt = generateJWT(user._id, user.username, user.isAdmin);

        sendSuccessResponse(response, "Sign-in successful.", {
            jwt: newJwt,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    })
);



module.exports = router;