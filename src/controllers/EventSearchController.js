const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/errorFunctions.js");
const { findAllPublicEvents, searchPublicEvents, searchPrivateEvents } = require("../utils/crud/EventSearchCrud.js");

const router = express.Router();

// Retrieve all public events (for inital page load)

router.get(
    "/public/all",
    handleRoute(async (request, response) => {
        const result = await findAllPublicEvents();

        if (!result.length){
            throw new AppError("No public events found.");
        }

        sendSuccessResponse(response, "All public events retrieved successfully.", result);
   })
);

// Search for public events

router.get(
    "/public",
    handleRoute(async (request, response) => {
        const { query } = request.query;

        if (!query ){
            throw new AppError("Search query is required.", 400);
        }

        const result = await searchPublicEvents(query);
        console.log("Search Result:", result);

        if (result.message) {
            return response.status(404).json({
                message: result.message
            });
        }

        sendSuccessResponse(response, "Event search completed successfully.", result);
    })
);


// Search for private events

router.get("/private",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { userId } = request.authUserData;
        const { query } = request.query;

        if (!query){
            throw new AppError("Search query is required.", 400);
        }

        const result = await searchPrivateEvents(query, userId);
        if (!result.length){
            throw new AppError("No private events found matching your search.");
        }

        sendSuccessResponse(response, "Event search completed successfully.", result);
    })
);


    module.exports = router;