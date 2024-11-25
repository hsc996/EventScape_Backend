const express = require("express");
const { UserModel } = require("../models/UserModel.js");
const { generateJWT } = require("../functions/jwtFunctions.js");
const bcrypt = require("bcrypt");

const router = express.Router();

const saltRounds = 10;


// Register new account

router.post("/signup", async (request, response) => {
    try {
        const { username, password, email } = request.body;
    
        if (!username || !password || !email){
            response.status(400).json({
                message: "Incorrect or missing sign-up credentials provided."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return response.status(400).json({
                message: "Invalid email format."
            })
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)){
            return response.status(400).json({
                message: "Password must be at least 8 characters and include at least one letter, one number, and one special character."
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        let newUser = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        console.log(`User created successfully: ${newUser.username} (${newUser.email})`);
    
        let newJwt = generateJWT(newUser._id, newUser.username);
    
        response.json({
            jwt: newJwt,
            user: {
                id: newUser,
                username: newUser.username,
                password: newUser.password
            }
        });
    } catch (error) {
        console.error("Server Error: ", error);
        response.status(500).json({error: "Internal Server Error."})
    }
});



// Sign in existing account
router.post("/signin", async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password){
            return response.status(400).json({
                message: "Incorrect or missing sign-in credentials provided."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return response.status(400).json({
                message: "Invalid email format."
            });
        }

        const user = await UserModel.findOne({
            email: email
        });

        if (!user){
            return response.status(404).json({
                message: "User not found. Please sign up first."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log("Provided password:", password);
        console.log("Stored hashed password:", user.password);

        if (!isPasswordValid){
            console.log("Invalid password attempt for email:", email); // Log the invalid password attempt
            return response.status(404).json({
                message: "Invalid password"
            });
        }

        let newJwt = generateJWT(user._id, user.username);

        response.json({
            jwt: newJwt,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Server Error: ", error);
        response.status(500).json({message: "Internal Server Error."});
    }
});



module.exports = router;