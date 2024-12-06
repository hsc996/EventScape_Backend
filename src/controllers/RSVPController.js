const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    createRSVP,
    updateRSVP,
    deleteRSVP,
    findRSVPsByResponse,
    findOneRSVP
    } = require("../utils/crud/RSVPCrud.js");
const { handleRoute,sendSuccessResponse, AppError } = require("../middleware/routerMiddleware.js");
const { sendError, checkRSVPExistence } = require("../functions/helperFunctions.js");
const { handleRouteError, checkEventPermission } = require("../middleware/routerMiddleware.js");


const router = express.Router();


// RSVP YES/NO/MAYBE

router.post(
    "/attending/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { userId } = request.authUserData;
        const { status } = request.body;

        if (!status){
            throw new AppError("Status is required.", 400);
        }

        if (!["yes", "maybe", "no"].includes(status)){
            throw new AppError("Invalid response type. Status must be 'yes', 'maybe' or 'no'.", 400);
        }

        try {
            const existingRsvp = await checkRSVPExistence(eventId, userId);
            if (existingRsvp){
                throw new AppError("You have already RSVP'd to this event. Use the PATCH route to update RSVP status.", 400);
            }

            const rsvpData = {
                eventId,
                userId,
                status
            };

            const newRSVP = await createRSVP(rsvpData);

            sendSuccessResponse(response, `RSVP for event ${eventId} by use ${userId} was recorded successfully.`, newRSVP);

        } catch (error) {
            handleRouteError(response, error, "Error posting RSVP response, please try again later.");
        }
    })
);



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

        const existingRsvp = await updateRSVP({ eventId, userId});
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