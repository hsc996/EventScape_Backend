const mongoose = require("mongoose");

const RSVPSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["yes", "no", "maybe"],
        required: true
    },
    respondedAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

const RSVPModel = mongoose.model("RSVP", RSVPSchema);

module.exports = {
    RSVPModel
}


