const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Homepage route to confirm server is running
app.get("/", (request, response) => {
    response.json({
        message: "Hello, world!"
    });
});

module.exports = {
    app
}