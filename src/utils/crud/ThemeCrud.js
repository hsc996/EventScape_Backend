const { ThemeTemplateModel } = require("../../models/ThemeModel.js");
const { EventModel } = require("../../models/EventModel.js");

// Find all theme templates
async function findAllTemplates(){
    try {
        const template = await ThemeTemplateModel.find();
        return template;
    } catch (error) {
        console.error("Error finding all theme templates: ", error);
        throw new Error("Error retrieving all theme templates, please try again.");
    }
}



// Find one theme template
async function findTemplate(query){
    try {
        const result = await ThemeTemplateModel.findOne(query);

        return result;
    } catch (error) {
        console.error("Error finding theme template: ", error);
        throw new Error("Error finding theme template, please try again.");
    }
}


// Update a theme template
async function updateThemeSelection(eventId, themeId){
    try {
        const updatedEvent = await EventModel.findByIdAndUpdate(
            eventId,
            { theme: themeId },
            { new: true, runValidators: true }
        );

        if (!updatedEvent){
            throw new Error("Event not found.");
        }

        return updatedEvent;
    } catch (error) {
        console.error("Error updating theme selection: ", error);
        throw new Error("Error updating theme selection, please try again.");
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
            throw new Error("Event not found.")
        }
    } catch (error) {
        console.error("Error removing theme selection: ", error);
            throw new Error("Error removing theme selection, please try again.");
    }
}

module.exports = {
    findTemplate,
    findAllTemplates,
    updateThemeSelection,
    removeThemeSelection
}