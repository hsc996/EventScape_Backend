const express = require("express");

const { findTemplate, findAllTemplates, updateThemeSelection, removeThemeSelection } = require("../utils/crud/ThemeCrud.js");

const router = express.Router();


// All routes start with "/themes"

// Get all theme templates (available for users to choose from)
router.get("/templates", async (request, response) => {
    try {
        
    } catch (error) {
        
    }
});






// Apply selected theme to an event page
router.post("/select/:eventId", async (request, response) => {
    try {
        
    } catch (error) {
        
    }
});






// Update theme selection
router.patch("/update/:eventId", async (request, response) => {
    try {
        const { eventId } = request.params;
        const { themeId } = request.body;

        const update = await updateThemeSelection(eventId, themeId);
        response.status(200).json({
            message: "Theme applied successfully",
            event: update
        });
    } catch (error) {
        console.error("Error updating theme selection: ", error);
        throw new Error("Error updating theme selection, please try again");
    }
});




// Remove theme selection
router.delete("/delete/:themeId", async (request, response) => {
    try {
        const { eventId } = request.body;
        const { themeId } = request.params;

        if (!eventId || !themeId){
            return response.status(400).json({
                error: "Both Event ID and Theme ID are required."
            });
        }

    } catch (error) {
        
    }
});


module.exports = router;