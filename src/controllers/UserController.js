// const express = require("express");
// const { UserModel } = require('../models/UserModel.js');

// const { findOneUser, findManyUsers } = require('../utils/crud/UserCrud.js');

// const router = express.Router();

// // Get user by ID
// router.get("/profile/:userId", async (request, response) => {
//     console.log("Searching for a user with ID of: " + request.params.userId);
//     let result = await findOneUser({_id: request.params.userId});
//     console.log("User found: " + JSON.stringify(result));
//     response.json({
//         data: result
//     });
// });