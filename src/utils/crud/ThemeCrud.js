const { default: mongoose } = require("mongoose");

const { ThemeTemplateModel } = require("../../models/ThemeModel.js");
const { EventModel } = require("../../models/EventModel.js");
const { AppError } = require("../../functions/errorFunctions.js");

// Find all theme templates
async function findAllTemplates(){
    try {
        const template = await ThemeTemplateModel.find();
        return template;

    } catch (error) {
        console.error("Error finding all theme templates: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error retrieving all theme templates, please try again.", 500);
    }
}



// Find one theme template
async function findTemplate(themeId){
    try {
        if (!mongoose.Types.ObjectId.isValid(themeId)){
            throw new AppError("Invalid theme ID.", 400);
        }

        const result = await ThemeTemplateModel.findOne({ _id: themeId });
        if (!result){
            throw new AppError(`Theme with ID ${themeId} not found.`, 404);
        }

        return result;

    } catch (error) {
        console.error("Error finding theme template: ", error);
        
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error finding theme template, please try again.", 500);
    }
}



// Update a theme template
async function updateThemeSelection(eventId, themeId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(themeId)){
            throw new AppError("Invalid event or theme ID.", 400);
        }

        if (!mongoose.Types.ObjectId.isValid(themeId)) {
            throw new AppError("Invalid theme ID.", 400);
        }

        const event = await EventModel.findById(eventId);
        if (!event){
            throw new AppError("Event ID not found.", 404);
        }

        const theme = await ThemeTemplateModel.findById(themeId);
        if (!theme){
            throw new AppError("Theme ID not found.", 404);
        }

        if (event.theme && event.theme.toString() === themeId){
            throw new AppError("The selected theme is already applied to this event.", 400);
        }

        const updatedEvent = await EventModel.findByIdAndUpdate(
            eventId,
            { theme: themeId },
            { new: true, runValidators: true }
        );

        if (!updatedEvent){
            throw new AppError("Error updating theme selection, please try again.", 500);
        }

        return updatedEvent;

    } catch (error) {
        console.error("Error updating theme selection: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error updating theme selection, please try again.", 500);
    }
}



// Remove theme selection
async function removeThemeSelection(eventId){
    try {
        const updatedEvent = await EventModel.findByIdAndUpdate(
            eventId,
            { theme: null },
            { new: true }
        );

        if (!updatedEvent){
            throw new AppError("Event not found.", 404)
        }

        return updatedEvent;

    } catch (error) {
        console.error("Error removing theme selection: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error removing theme selection, please try again.", 500);
    }
}

module.exports = {
    findTemplate,
    findAllTemplates,
    updateThemeSelection,
    removeThemeSelection
}