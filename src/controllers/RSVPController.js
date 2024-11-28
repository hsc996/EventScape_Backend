const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { RSVPModel } = require("../controllers/RSVPController.js");
const { createRSVP, updateRSVP, deleteRSVP, findRSVPsByResponse } = require("../utils/crud/RSVPCrud.js");

const router = express.Router();


// RSVP YES
router.post("/attending/:eventId", async (request, response) => {
    const { userId, response: userResponse } = request.body;
    const { eventId } = request.params;

    try {
        if (!userId || !!userResponse){
            return response.status(400).json({
                message: "Please provide both userId and response."
            });
        }

        if (!["yes", "maybe", "no"].includes(userResponse)){
            return response.status(400).json({
                message: "Invalid response type."
            });
        }

        const rsvpData = {
            eventId,
            userId,
            response: userResponse
        };

        const newRsvp = await createRSVP(rsvpData);

        response.status(201).json({
            message: `RSVP for event ${eventId} by user ${userId} was recorded successfully.`,
            data: {
                eventId: newRSVP.eventId,
                userId: newRSVP.userId,
                response: newRSVP.response,
                respondedAt: newRSVP.respondedAt
            }
        });
    } catch (error) {
        console.error("Error posting RSVP response: ", error);
        response.status(500).json({ error: "Internal Server Error. Please try again."})
    }
});




// RSVP NO
router.post("/notattending", async (request, response) => {
    try {
        
    } catch (error) {
        
    }
});




// RSVP MAYBE
router.post("/maybeattending", async (request, response) => {
    try {
        
    } catch (error) {
        
    }
});


// Update RSVP






// Delete RSVP





// Find list RSVPs depending on field yes/no/maybe
router.get("/rsvplist/:eventId", async (request, response) => {
    const { eventId } = request.params;
    const { status } = request.query;

    try {
        const rsvps = await findRSVPsByResponse(eventId, response);
        response.json({
            message: `RSVP list for '${response}' retrieved successfully.`,
            data: rsvps
        });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});


module.exports = router;