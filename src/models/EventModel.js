const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        text: true
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        trim: true,
        text: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    invited: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    not_attending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    maybe_attending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    theme: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "ThemeTemplate",
        default: null
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

EventSchema.index({ eventName: "text", description: "text" });

const EventModel = mongoose.model("Event", EventSchema);

module.exports = {
    EventModel
}