const mongoose = require("mongoose");

const ThemeSchema = new mongoose.Schema({
    themeName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    styles: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ThemeTemplateModel = mongoose.model("ThemeTemplate", ThemeSchema);

module.exports = { 
    ThemeTemplateModel
}