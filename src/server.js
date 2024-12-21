const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


let corsOptions = {
    origin: function (origin, callback) {
        const validOrigins = [
            /^http:\/\/localhost:\d+$/,
            /^http:\/\/127\.0\.0\.1:\d+$/,
            /^https:\/\/eventscape\d*\.netlify\.app$/,
            "https://eventscape1.netlify.app"
        ];

        // Check if the origin is in the allowed list or if it's a non-browser request
        if (!origin || validOrigins.some((regex) => (typeof regex === 'string' ? regex === origin : regex.test(origin)))){
            // Allow request
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`)
            const err = new Error("Not allowed by CORS");
            err.status = 403;
            callback(err, false);
        }
    },
    methods: "GET,PATCH,POST,DELETE,OPTIONS",
    credentials: true, 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Pre-flight handler - must be above routes
app.options("*", cors(corsOptions));


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