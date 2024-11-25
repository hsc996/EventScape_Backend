const express = require("express");
const bcrypt = require("bcrypt");

const { findOneUser, updateOneUser, deleteOneUser } = require('../utils/crud/UserCrud.js');
const { UserModel } = require("../models/UserModel.js");
const { validateUserAuth } = require('../middleware/validateUserAuth.js');

const router = express.Router();


// View Profile

router.get("/search/:userId", async (request, response) => {
    try {
        
        let result = await findOneUser({_id: request.params.userId});

        if (!result){
            return response.status(404).json({error: "User not found."});
        }

        console.log("User found: " + JSON.stringify(result));

        response.json({
            data: result
        });
    } catch (error) {
        console.error("Error finding user: ", error);
        response.status(500).json({error: "Internal Server Error."});
    }
});


// Update Profile Data

router.patch('/:userId', validateUserAuth, async (request, response) => {
    try {
        
        const updateData = request.body;

        if (updateData.username){
            const existingUser = await UserModel.findOne({ username: updateData.username});
            if (existingUser && existingUser._id.toString() !== request.params.userId){
                return response.status(400).json({
                    message:"Username already taken. Please choose a different one."
                });
            }
        }

        if (updateData.password){
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(updateData.password)){
                return response.status(400).json({
                    message: "Password must be at least 8 characters and include at least one letter, one number, and one special character."
                });
            }
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        let result = await updateOneUser(
            {_id: request.params.userId},
            updateData
        );

        // If no result, return error message
        if (!result){
            return response.status(404).json({error: "User not found."});
        }

        response.json({
            message: "Profile data updated successfully.",
            data: result
        })
    } catch (error) {
        console.error("Error updating user data: ", error);
        response.status(500).json({error: "Internal Server Error."});
    }
});



// Delete Profile

router.delete("/delete/:userId", validateUserAuth,  async (request, response) => {
    try {

        let userToBeDeleted = request.params.userId;

        let result = await deleteOneUser({_id: userToBeDeleted});

        if (!result){
            return response.status(404).json({error: "User not found."});
        }

        console.log("Profile with ID " + JSON.stringify(result) + "deleted successfully.");

        response.json({
            message: "Profile data deleted successfully.",
            data: result
        })

    } catch (error) {
        console.error("Error deleting user data: ", error);
        response.status(500).json({error: "Internal Server Error."});
    }
});


module.exports = router;