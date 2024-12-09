const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    findTemplate,
    findAllTemplates,
    updateThemeSelection,
    removeThemeSelection
    } = require("../utils/crud/ThemeCrud.js");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/helperFunctions.js");
const { checkEventPermission } = require("../middleware/routerMiddleware.js");

const router = express.Router();


// Get all theme templates (available for users to choose from)
router.get(
    "/find",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const result = await findAllTemplates();

        sendSuccessResponse(response, "All theme templates retreieved successfully", result);
    })
);


// Find specific theme template
router.get(
    "/:themeId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { themeId } = request.params;

        const result = await findTemplate(themeId);

        sendSuccessResponse(response, `Theme with ID ${themeId} retrieved successfully.`, result);
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

        const result = await updateThemeSelection(eventId, themeId, userId);

        sendSuccessResponse(response, `Theme with ID ${themeId} applied successfully to event with ID ${eventId}`, result);
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
        
        const result = await updateThemeSelection(eventId, themeId, userId);
        
        sendSuccessResponse(response, `Theme with ID ${themeId} successfully applied.`);
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

        const result = await removeThemeSelection(eventId);
        
        sendSuccessResponse(response, "Theme template removed from event successfully.", result);
    })
);




module.exports = router;