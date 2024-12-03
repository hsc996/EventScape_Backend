const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    findTemplate,
    findAllTemplates,
    updateThemeSelection,
    removeThemeSelection
} = require("../utils/crud/ThemeCrud.js");

const router = express.Router();


// Get all theme templates (available for users to choose from)
router.get("/", async (request, response) => {
    try {
        const result = await findAllTemplates();
        
        response.status(200).json({
            message: "All theme templates retrieved successfully.",
            data: result
        });

    } catch (error) {
        console.error("Error fetching theme templates: ", error);
        
        response.status(500).json({
            error: "Internal Server Error.",
            message: "Error fetching theme updates, please try again."
        });
    }
});


// Find specific theme template
router.get("/:themeId", async (request, response) => {
    const { themeId } = request.params;

    try {
        const result = await findTemplate(themeId);
        
        response.status(200).json({
            message: `Theme with ID ${themeId} retrieved successfully.`,
            data: result
        });

    } catch (error) {
        console.error("An error occurred while attempting to retrieve theme template: ", error);
        
        response.status(500).json({
            error: "Internal Server Error.",
            message: "An error occurred while attempting to retrieve theme template, please try again."
        });
    }
});




// Apply selected theme to an event page
router.post("/select/:eventId", validateUserAuth, async (request, response) => {

    const { eventId } = request.params;
    const { themeId } = request.body;
    
    try {
        if (!themeId) {
            return response.status(400).json({
                message: "Theme ID is required in the request body."
            });
        }        

        const result = await updateThemeSelection(eventId, themeId);

        response.status(200).json({
            message: `Theme with ID ${themeId} applied successfully to event with ID ${eventId}`,
            data: result
        });

    } catch (error) {
        console.error("An error occurred while attempting to apply theme to event: ", error);
        
        response.status(500).json({
            error: "Internal Server Error.",
            message: "An error occurred while attempting to apply theme, please try again."
        });
    }
 });
    





// Update theme selection
router.patch("/update/:eventId", validateUserAuth, async (request, response) => {
    const { eventId } = request.params;
    const { themeId } = request.body;
    
    try {
        if (!themeId) {
            return response.status(400).json({
                message: "Theme ID is required in the request body."
            });
        }
        
        const result = await updateThemeSelection(eventId, themeId);

        response.status(200).json({
            message: `Theme with ID ${themeId} successfully updated for event with ID ${eventId}.`,
            data: result
        });

    } catch (error) {
        console.error("Error updating theme selection: ", error);

        response.status(500).json({
            error: "Internal Server Error.",
            message: "Error updating theme selection, please try again"
        });
    }
});



// Remove theme selection
router.delete("/delete/:themeId", validateUserAuth, async (request, response) => {
    try {
        const { eventId } = request.body;
        const { themeId } = request.params;

        if (!eventId){
            return response.status(400).json({
                error: "Both event ID and theme ID are required."
            });
        }

        const result = await removeThemeSelection(eventId, themeId)
        
        response.status(200).json({
            message: "Theme template removed from event successfully.",
            data: result
        });
        
    } catch (error) {
        console.error("An error occurred while attempting to remove theme from event page: ", error);
        
        response.status(500).json({
            error: "Internal Server Error.",
            message: "An error occurred while attemping to remove theme from event page, please try again."
        });
    }
});


module.exports = router;