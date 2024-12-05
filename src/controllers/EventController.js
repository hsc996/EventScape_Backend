const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    createEvent,
    findOneEvent,
    updateOneEvent,
    deleteOneEvent,
    findActiveEventsForUser
} = require("../utils/crud/EventCrud.js");

const router = express.Router();


// Find all active events user is attending -- NOT TESTED YET

router.get("/attending/:userId", async (request, response) => {
    try {
        const { userId } = request.params;

        if (!userId){
            return response.status(404).json({error: "User not found."});
        }
    
        const events = await findActiveEventsForUser(userId);
    
        if (!events.length){
            return response.status(404).json({error: "No active events found for this user."});
        }
    
        response.status(200).json({ message: "Active events retrieved successfully", data: events });
    } catch (error) {
        console.error("Error retrieving active events: ", error.message);
        response.status(500).json({ error: "Internal server error. Please try again later." });
    }
})


// View Event

router.get("/search/:eventId", async (request, response) => {
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

router.patch("/update/:eventId", validateUserAuth, async (request, response) => {
    try {
        const { eventId } = request.params;
        const updateData = request.body;

        if (!eventId){
            return response.status(404).json({error: "Event not found."});
        }

        const updatedEvent = await updateOneEvent(
            {_id: eventId},
            updateData
        );

        if (!updatedEvent){
            return response.status(404).json({error: "Event not found or could not be updated."});
        }

        response.json({
            message: "Event data updated successfully.",
            data: updatedEvent
        })

    } catch (error) {
        console.error("Error updating event data: ", error);
        response.status(500).json({error: "Internal Server Error."})
    }
});



// Delete
router.delete("/delete/:eventId", validateUserAuth, async (request, response) => {
    try {
        let eventToBeDeleted = request.params.eventId;

        let deletedEvent = await deleteOneEvent({_id: eventToBeDeleted});

        if (!deletedEvent){
            return response.status(404).json({error: "Event not found."});
        }

        console.log("Event with ID " + JSON.stringify(deletedEvent) + "deleted successfully.");

        response.json({
            message: "Event data deleted successfully.",
            data: deletedEvent
        })

    } catch (error) {
        console.error("Error deleting event data: ", error);
        response.status(500).json({error: "Internal Server Error."});
    }
});


module.exports = router;