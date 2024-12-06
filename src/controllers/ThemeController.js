const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    findTemplate,
    findAllTemplates,
    updateThemeSelection,
    removeThemeSelection
    } = require("../utils/crud/ThemeCrud.js");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError, handleRouteError } = require("../functions/errorFunctions.js");
const { checkEventPermission } = require("../middleware/routerMiddleware.js");

const router = express.Router();


// Get all theme templates (available for users to choose from)
router.get(
    "/",
    validateUserAuth,
    handleRoute(async (request, response) => {
        try {

            const result = await findAllTemplates();

            sendSuccessResponse(response, "All theme templates retreieved successfully", result);
        
        } catch (error) {
            handleRouteError(response, error, "Error retrieving theme templates, please try again later.");
        }
    })
);


// Find specific theme template
router.get(
    "/:themeId",
    validateUserAuth,
    handleRoute(async (request, response) => {

        const { themeId } = request.params;

        try {
            const result = await findTemplate(themeId);

            sendSuccessResponse(response, `Theme with ID ${themeId} retrieved successfully.`, result);
        
        } catch (error) {
            handleRouteError(response, error, "Error retrieving theme, please try again later.");
        }
    })
);




// Apply selected theme to an event page
router.post(
    "/select/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { themeId } = request.body;
        const { userId } = request.authUserData;
        
        if (!themeId) {
            throw new AppError("Theme ID is required in the request body.", 400);
        }

        try {
            const result = await updateThemeSelection(eventId, themeId, userId);

            sendSuccessResponse(response, `Theme with ID ${themeId} applied successfully to event with ID ${eventId}`, result);
       
        } catch (error) {
            handleRouteError(response, error, "Error applying theme to event page, please try again later.");
        }
    })
);

    


// Update theme selection
router.patch(
    "/update/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { themeId } = request.body;
        const { userId } = request.authUserData;

        if (!themeId) {
            return sendError(response, 400, "Theme ID is required in the request body.");
        }
        
        try {
            const result = await updateThemeSelection(eventId, themeId, userId);
            
            sendSuccessResponse(response, `Theme with ID ${themeId} successfully applied.`);
        } catch (error) {
            handleRouteError(response, error, "Error updating theme selection, please try again later.");
        }
    })
);





// Remove theme selection
router.delete(
    "/delete/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;

        if (!eventId) {
            return sendError(response, 400, "Event ID is required.");
        }

        try {
            const result = await removeThemeSelection(eventId);
            
            sendSuccessResponse(response, "Theme template removed from event successfully.", result);
        } catch (error) {
            handleRouteError(response, error, "Error removing theme from event, please try again later.");
        }
    })
);




module.exports = router;