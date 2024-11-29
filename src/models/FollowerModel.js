const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

FollowerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const FollowerModel = mongoose.model("Follower", FollowerSchema);

module.exports = {
    FollowerModel
}