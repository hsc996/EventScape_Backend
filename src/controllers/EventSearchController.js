const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/errorFunctions.js");
const { findPublicEvents, findPrivateEvents } = require("../utils/crud/EventSearchCrud.js");

const router = express.Router();

// Search for public events

router.get("/public",
    validateUserAuth,
    async (request, response) => {
        const { query } = request.query;

        if (!query ){
            throw new AppError("Search query is required.", 400);
        }

        const result = await findPublicEvents(query);
        console.log("Search Result:", result);

        if (result.message) {
            return response.status(404).json({
                message: result.message
            });
        }

        sendSuccessResponse(response, "Event search completed successfully.", result);
    }
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

        const result = await findPrivateEvents(query, userId);
        if (!result.length){
            throw new AppError("No private events found matching your search.");
        }

        sendSuccessResponse(response, "Event search completed successfully.", result);
    })
);


    module.exports = router;