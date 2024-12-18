const express = require("express");
const mongoose = require("mongoose");

const { findOneUser, updateOneUser, deleteOneUser } = require('../utils/crud/UserCrud.js');
const { validatePassword, hashPassword } = require("../functions/helperFunctions.js");
const { UserModel } = require("../models/UserModel.js");
const { validateUserAuth } = require('../middleware/validateUserAuth.js');
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/errorFunctions.js");

const router = express.Router();


// View Profile

router.get(
    "/view/:userId",
    handleRoute(async (request, response) => {
        const { userId } = request.params;
        
        let result = await findOneUser({ _id: userId });

        if (!result){
            throw new AppError("User not found.", 404);
        }

        sendSuccessResponse(response, `User profile with ID ${userId} found successfully.`, result);
    })
);


// Update Profile Data

router.patch(
    "/edit",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const userId = request.authUserData.userId;
        const updateData = request.body;

        if (updateData.username) {
            const duplicateUser = await UserModel.findOne({ username: updateData.username });
            if (duplicateUser && duplicateUser._id.toString() !== userId) {
                throw new AppError("Username already taken. Please choose a different one.", 400);
            }
        }

        if (updateData.password) {
            if (!validatePassword(updateData.password)) {
                throw new AppError("Password must be at least 8 characters and include at least one letter, one number, and one special character.", 400);
            }
            updateData.password = await hashPassword(updateData.password);
        }

        const result = await updateOneUser({ _id: new mongoose.Types.ObjectId(userId) }, updateData);

        if (!result) {
            throw new AppError("User not found.", 404);
        }

        sendSuccessResponse(response, "Profile data updated successfully.", result);
    })
);



// Delete Profile

router.delete(
    "/delete",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const userId = request.authUserData.userId;

        const result = await deleteOneUser({_id: userId});

        if (!result || result.deletedCount === 0){
            throw new AppError("User not found.", 404);
        }

        sendSuccessResponse(response, `Profile with ID ${userId} deleted successfully.`, result);
    })
);


module.exports = router;