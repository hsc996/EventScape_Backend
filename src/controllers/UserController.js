const express = require("express");

const { findOneUser, updateOneUser, deleteOneUser } = require('../utils/crud/UserCrud.js');
const { sendError, validatePassword, hashPassword } = require("../functions/helperFunctions.js");
const { UserModel } = require("../models/UserModel.js");
const { validateUserAuth } = require('../middleware/validateUserAuth.js');

const saltRounds = 10;

const router = express.Router();


// View Profile

router.get("/search/:userId", async (request, response) => {
    try {
        const { userId } = request.params;
        
        let result = await findOneUser({_id: userId});

        if (!result){
            return sendError(response, 404, "User not found.");
        }

        console.log("User found: " + JSON.stringify(result));

        response.status(200).json({
            message: `User with ID ${userId} found.`,
            data: result
        });
    } catch (error) {
        console.error("Error finding user: ", error);
        sendError(response, 500, "Internal Server Error.");
    }
});


// Update Profile Data

router.patch('/:userId', validateUserAuth, async (request, response) => {
    try {
        
        const updateData = request.body;

        if (updateData.username){
            const existingUser = await UserModel.findOne({ username: updateData.username});
            if (existingUser && existingUser._id.toString() !== request.params.userId){
                return sendError(response, 400, "Username already taken. Please choose a different one.");
            }
        }

        if (updateData.password){
            if (!validatePassword(updateData.password)){
                return sendError(response, 400, "Password must be at least 8 characters and include at least one letter, one number, and one special character.");
            }
            updateData.password = await hashPassword(updateData.password);
        }

        let result = await updateOneUser(
            {_id: request.params.userId},
            updateData
        );

        // If no result, return error message
        if (!result){
            return sendError(response, 404, "User not found.");
        }

        response.status(200).json({
            message: "Profile data updated successfully.",
            data: result
        });
    } catch (error) {
        console.error("Error updating user data: ", error);
        sendError(response, 500, "Internal Server Error.");
    }
});



// Delete Profile

router.delete("/delete/:userId", validateUserAuth,  async (request, response) => {
    try {

        let userToBeDeleted = request.params.userId;

        let result = await deleteOneUser({_id: userToBeDeleted});

        if (!result){
            return sendError(response, 404, "User not found.");
        }

        console.log("Profile with ID " + JSON.stringify(result) + "deleted successfully.");

        response.json({
            message: "Profile data deleted successfully.",
            data: result
        })

    } catch (error) {
        console.error("Error deleting user data: ", error);
        sendError(response, 500, "Internal Server Error.");
    }
});


module.exports = router;