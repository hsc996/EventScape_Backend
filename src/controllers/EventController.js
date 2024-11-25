const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { EventModel } = require("../controllers/EventController.js");
const { createEvent, findOneEvent } = require("../utils/crud/EventCrud.js");

const router = express.Router();


// Read Event
router.get("search/:eventId", async (request, response) => {
    try {

        let result = await findOneEvent({_id: request.params.eventId});

        if (!result){
            return response.status(404).json({error: "Event not found."});
        }

        console.log("User found: " + JSON.stringify(result));

        response.json({
            data: result
        });

    } catch (error) {
        console.error("Error finding event: ", error);
        response.status(500).json({error: "Internal Server Error."});
    }
});



// Create Event
router.post("/create", validateUserAuth, async (request, response) => {
    try {
        
        const {
            eventName,
            description,
            eventDate,
            location,
            host,
            attendees
        } = request.body;

        if (!eventName || !description || !eventDate || !location || !host || !attendees){
            return response.status(400).json({
                message: "Please complete all of the required fields."
            });
        }

        if (new Date(eventDate) <= new Date()) {
            return response.status(400).json({
                message: "Event date must be in the future."
            });
        }

        if (location.trim().length < 3) {
            return response.status(400).json({
                message: "Location must be at least 3 characters long."
            });
        }

        let newEvent = await createEvent(eventName, description, eventDate, location, host, attendees);

        console.log(`Event created successfully: ${newEvent.eventName} at ${newEvent.location}`);

        response.status(201).json({
            message: "Event created successfully.",
            event: {
                id: newEvent._id,
                eventName: newEvent.eventName,
                description: newEvent.description,
                eventDate: newEvent.eventDate,
                location: newEvent.location,
                host: newEvent.host,
                attendees: newEvent.attendees
            }
        });

    } catch (error) {
        console.error("Error creating event: ", error);
        return response.status(500).json({
            message: error.message || "An error occurred while creating the event."
        });
    }
});




// Update Event





// Delete


module.exports = router;