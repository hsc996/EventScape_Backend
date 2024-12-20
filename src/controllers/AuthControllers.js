const express = require("express");
const { UserModel } = require("../models/UserModel.js");
const { generateJWT } = require("../functions/jwtFunctions.js");
const {
    hashPassword,
    comparePassword
} = require("../functions/helperFunctions.js");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/errorFunctions.js");
const { userValidationSchema, signinValidationSchema } = require("../utils/validation/userValidation.js");

const router = express.Router();

const saltRounds = 10;


// Register new account route

router.post(
    "/signup",
    handleRoute(async (request, response) => {
        const { username, password, email, isAdmin } = request.body;

        const { error } = userValidationSchema.validate({ username, password, email, isAdmin });
        if (error){
            
            throw new AppError(error.details.map(detail => detail.message).join(", ").replace(/\"/g, ''), 400);
        }

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
            password: hashedPassword,
            isAdmin: isAdmin || false
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
        const { error } = signinValidationSchema.validate(request.body);
        if (error){
            const errorMessage = error.details.map(detail => detail.message).join(", ").replace(/\"/g, '');
            throw new AppError(errorMessage, 400);
        }

        const { email, password } = request.body;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw new AppError("User not found. Please sign up first.", 404);
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            console.log("Incorrect password attempt for email:", email);
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