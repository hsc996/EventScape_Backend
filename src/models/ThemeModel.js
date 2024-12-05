const mongoose = require("mongoose");

const ThemeSchema = new mongoose.Schema({
    themeName: {
        type: String,
        required: true
    },
    theme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ThemeTemplate"
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