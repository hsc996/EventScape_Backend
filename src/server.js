const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


let corsOptions = {
    origin: function (origin, callback) {
        const validOrigins = [
            "http://localhost:3000",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5173",
            "https://eventscape1.netlify.app"
        ];

        if (validOrigins.includes(origin) || !origin){
            callback(null, true);
        } else {
            const err = new Error("Not allowed by CORS");
            err.status = 403;
            callback(err, false);
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true, 
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

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