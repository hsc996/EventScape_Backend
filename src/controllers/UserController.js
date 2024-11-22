const express = require("express");

const { findOneUser, findManyUsers, updateOneUser } = require('../utils/crud/UserCrud.js');

const router = express.Router();


// Get user by username
router.get("/:userId", async (request, response) => {
    try {
        console.log("Searching for a user with ID of: " + request.params.userId);
        
        let result = await findOneUser({_id: request.params.userId});
        
        console.log("User found: " + JSON.stringify(result));

        if (!result){
            return response.status(404).json({error: "User not found."});
        }

        response.json({
            data: result
        });
    } catch (error) {
        console.error("Error finding user: ", error);
        response.status(500).json({error: "Server error"});
    }
});


// Update Profile Data
router.patch('/:userId', async (request, response) => {
    try {
        console.log("Updating profile of user with ID: " + request.params.userId);
        
        const updateData = request.body;

        let result = await updateOneUser(
            {_id: request.params.userId},
            updateData
        );

        console.log("User found: " + JSON.stringify(result));

        // If no result, return error message
        if (!result){
            return response.status(404).json({error: "User not found."});
        }

        response.json({
            data: result
        })
    } catch (error) {
        console.error("Error updating user: ", error);
        response.status(500).json({error: "Server error"});
    }
});






// Delete Profile

module.exports = router;