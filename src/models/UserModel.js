const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {
    UserModel
}