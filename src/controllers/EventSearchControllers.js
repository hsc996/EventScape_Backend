const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError, handleRouteError } = require("../functions/errorFunctions.js");
const { findPublicEvents, findPrivateEvents } = require("../utils/crud/EventSearchCrud.js");

const router = express.Router();

router.get("/public",
    validateUserAuth,
    async (request, response) => {
        try {
            const { query } = request.query;

            if (!query){
                throw new AppError("Search query is required.", 400);
            }

            const result = await findPublicEvents(query);
            if (!result.length){
                throw new AppError("No public events found matching your search.", 404);
            }

            sendSuccessResponse(response, "Event search completed successfully.", result);
        } catch (error) {
            handleRouteError(response, error, "Could not complete search at this time, please try again later.")
        }
    }
);


router.get("/private",
    validateUserAuth,
    handleRoute(async (request, response) => {
        try {
            const { query } = request.query;

            if (!query){
                throw new AppError("Search query is required.", 400);
            }

            const result = await findPrivateEvents(query);
            if (!result.length){
                throw new AppError("No private events found matching your search.");
            }

            sendSuccessResponse(response, "Event search completed successfully.", result);
        } catch (error) {
            handleRouteError(response, error, "Could not complete search at this time, please try again later.")
        }
    })
);


    module.exports = router;