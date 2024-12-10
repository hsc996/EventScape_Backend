const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


const allowedOrigins = {
    production: ["https://eventscape1.netlify.app"],
    development: [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ]
};

// let corsOptions = {
//     origin: (origin, callback) => {
//         if (process.env.NODE_ENV === "production"){
//             if (origin === "https://eventscape1.netlify.app"){
//                 return callback(null, true);
//             }
//         } else {
//             const allowedOrigins = [
//                 "http://localhost:8080", 
//                 "http://localhost:5173", 
//                 "http://127.0.0.1:5173"
//             ];
//             if (allowedOrigins.includes(origin) || !origin) {
//                 return callback(null, true);
//             }
//         }
//         const err = new Error("CORS not allowed");
//         err.status = 403;
//         return callback(err);
//     },
//     optionsSuccessStatus: 200,
//     credentials: true
// };
// app.use((err, req, res, next) => {
//     if (err.message === "CORS not allowed") {
//         return res.status(403).json({ message: "CORS not allowed" });
//     }
//     next(err);
// });
// app.use(cors(corsOptions));


// Global error handler for CORS
app.use((err, req, res, next) => {
    if (err.message === "CORS not allowed") {
        return res.status(403).json({ message: "CORS not allowed" });
    }
    next(err);
});



// Homepage route to confirm server is running
app.get("/", (request, response) => {
    response.status(200).json({
        message: "Hello, world!"
    });
});


const AuthController = require("./controllers/AuthControllers.js");
app.use("/account", AuthController);

const UserController = require("./controllers/UserController.js");
app.use("/user", UserController);

const EventController = require("./controllers/EventController.js");
app.use("/event", EventController);

const RSVPController = require("./controllers/RSVPController.js");
app.use("/rsvp", RSVPController);

const FollowController = require("./controllers/FollowerController.js");
app.use("/follow", FollowController);

const ThemeController = require("./controllers/ThemeController.js");
app.use("/themes", ThemeController);

const EventSearchController = require("./controllers/EventSearchController.js");
app.use("/search", EventSearchController);

module.exports = {
    app
}