const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { RSVPModel } = require("../models/RSVPModel.js");
const { createRSVP, updateRSVP, deleteRSVP, findRSVPsByResponse, findOneRSVP } = require("../utils/crud/RSVPCrud.js");

const router = express.Router();


// RSVP YES/NO/MAYBE

router.post("/attending/:eventId", validateUserAuth, async (request, response) => {
    const { userId, status } = request.body;
    const { eventId } = request.params;

    try {
        if (!userId || !status){
            return response.status(400).json({
                message: "Please provide both user ID and status."
            });
        }

        if (!["yes", "maybe", "no"].includes(status)){
            return response.status(400).json({
                message: "Invalid response type."
            });
        }

        const existingRsvp = await findOneRSVP({ eventId, userId });
        if (existingRsvp){
            return response.status(400).json({
                message: "You have already RSVP'd to this event. Use the PATCH route to update RSVP status."
            })
        }

        const rsvpData = {
            eventId,
            userId,
            status: status
        };

        const newRSVP = await RSVPModel.create(rsvpData);

        response.status(201).json({
            message: `RSVP for event ${eventId} by user ${userId} was recorded successfully.`,
            data: newRSVP
        });
    } catch (error) {
        console.error("Error posting RSVP response: ", error);
        response.status(500).json({ error: "Internal Server Error. Please try again."})
    }
});



// Update RSVP
router.patch("/update", validateUserAuth, async (request, response) => {
    const { eventId, status } = request.body;
    const { userId } = request.authUserData;

    try {
        if (!eventId || !status){
            return response.status(400).json({
                message: "Please provide both eventId and status."
            });
        }

        const existingRsvp = await findOneRSVP({ eventId, userId});
        if (!existingRsvp){
            return response.status(400).json({
                message: "You have not RSVP'd to this event yet. Please use the POST route to RSVP."
            });
        }

        existingRsvp.status = status;
        await existingRsvp.save();

        response.status(200).json({
            message: `RSVP for event ${eventId} updated successfully.`,
            data: existingRsvp
        });



    } catch (error) {
        console.error("Error updating RSVP status: ", error);
        throw new Error("Error updating RSVP status, please try again.");
    }
});



// Delete RSVP
router.delete("/delete/:rsvpId", validateUserAuth, async (request, response) => {
    const { rsvpId } = request.params;
    const { userId } = request.authUserData;


    try {
        if (!rsvpId){
            return response.status(400).json({
                message: "RSVP ID is required."
            });
        }

        const existingRsvp = await findOneRSVP({ _id: rsvpId, userId});
        if (!existingRsvp){
            return response.status(404).json({
                message: "RSVP not found or you are not authorised to delete this RSVP."
            })
        }

        const result = await deleteRSVP({ _id: rsvpId, userId });

        if (result.deletedCount === 0){
            return response.status(400).json({
                message: "Error deleting RSVP, please try again."
            })
        }

        response.status(200).json({
            message: "RSVP deleted successfully."
        });

    } catch (error) {
        console.error("Error deleting RSVP: ", error);
        response.status(500).json({
            message: "Error deleting RSVP, please try again."
        });
    }
});




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