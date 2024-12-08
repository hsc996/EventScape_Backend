const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/helperFunctions.js");
const { findPublicEvents, findPrivateEvents } = require("../utils/crud/EventSearchCrud.js");

const router = express.Router();

router.get("/public",
    validateUserAuth,
    async (request, response) => {
        const { query } = request.query;

        if (!query){
            throw new AppError("Search query is required.", 400);
        }

        const result = await findPublicEvents(query);
        console.log("Search Result:", result);

        if (!result.length){
            throw new AppError("No public events found matching your search.", 404);
        }

        sendSuccessResponse(response, "Event search completed successfully.", result);
    }
);


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