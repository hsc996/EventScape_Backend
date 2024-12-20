const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    createRSVP,
    updateRSVP,
    deleteRSVP,
    findRSVPsByResponse
    } = require("../utils/crud/RSVPCrud.js");
const { handleRoute,sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { checkRSVPExistence } = require("../functions/helperFunctions.js");
const { checkRsvpPermission } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/errorFunctions.js");


const router = express.Router();


// RSVP To Event - YES/NO/MAYBE

router.post(
    "/attending/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { userId } = request.authUserData;
        const { status } = request.body;

        console.log("Received data:", { eventId, userId, status });

        if (!status){
            throw new AppError("Status is required.", 400);
        }

        const existingRsvp = await checkRSVPExistence(eventId, userId);

        if (existingRsvp) {
            console.log("Updating RSVP with:", { eventId, userId, status });
            const updatedRSVP = await updateRSVP({ eventId, userId }, { eventId, userId, status });
            sendSuccessResponse(response, `RSVP for event ${eventId} updated successfully.`, updatedRSVP);
        } else {
            const newRSVP = await createRSVP({ eventId, userId, status });
            sendSuccessResponse(response, `RSVP for event ${eventId} by user ${userId} was recorded successfully.`, newRSVP);
        }
    })
);


// Delete RSVP
router.delete(
    "/delete/:rsvpId",
    validateUserAuth,
    checkRsvpPermission,
    handleRoute(async (request, response) => {
        const { rsvpId } = request.params;

        if (!rsvpId){
            throw new AppError("RSVP ID is required.", 400);
        }

        const result = await deleteRSVP({ _id: rsvpId });

        if (result.deletedCount === 0){
            throw new AppError("Error removing RSVP, please try again.", 400);
        }

        sendSuccessResponse(response, "RSVP removed successfully.");
    })
);


// Find list of RSVPs by status on one particular event

router.get(
    "/status/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { status } = request.query;

        if (!eventId) {
            throw new AppError("Event ID is required.", 400);
        }

        const query = { eventId };
        if (status) {
            query.response = status;
        }

        console.log("Query to find RSVPs:", query);

        const rsvps = await findRSVPsByResponse(query);
        if (!rsvps || rsvps.length === 0) {
            throw new AppError("No RSVPs found for the given event.", 404);
        }

        sendSuccessResponse(response, "RSVP list retrieved successfully.", rsvps);
    })
);




module.exports = router;