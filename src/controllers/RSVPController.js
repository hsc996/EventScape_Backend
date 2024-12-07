const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    createRSVP,
    updateRSVP,
    deleteRSVP,
    findRSVPsByResponse
    } = require("../utils/crud/RSVPCrud.js");
const { handleRoute,sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { checkRSVPExistence, handleRouteError, AppError } = require("../functions/helperFunctions.js");
const { checkRsvpPermission } = require("../middleware/routerMiddleware.js");


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

            if (existingRsvp) {
                const updatedRSVP = await updateRSVP({ eventId, userId }, { eventId, userId, status });
                sendSuccessResponse(response, `RSVP for event ${eventId} updated successfully.`, updatedRSVP);
            } else {
                const newRSVP = await createRSVP({ eventId, userId, status });
                sendSuccessResponse(response, `RSVP for event ${eventId} by user ${userId} was recorded successfully.`, newRSVP);
            }

        } catch (error) {
            handleRouteError(response, error, "Error handling RSVP response, please try again later.");
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


        try {
            if (!rsvpId){
                throw new AppError("RSVP ID is required.", 400);
            }

            const result = await deleteRSVP({ _id: rsvpId });

            if (result.deletedCount === 0){
                throw new AppError("Error removing RSVP, please try again.", 400);
            }

            sendSuccessResponse(response, "RSVP removed successfully.");

        } catch (error) {
            handleRouteError(response, error, "Error removing RSVP, please try again.");
        }
    })
);


// Find list of RSVPs by status on one particular event

router.get(
    "/status/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { status } = request.query;

        try {
            if (!eventId) {
                throw new AppError("Event ID is required.", 400);
            }

            // Prepare the query object
            const query = { eventId };
            if (status) {
                query.response = status;  // Ensure 'status' is passed as 'response'
            }

            console.log("Query to find RSVPs:", query); // Log the query to debug

            const rsvps = await findRSVPsByResponse(query);
            if (!rsvps || rsvps.length === 0) {
                throw new AppError("No RSVPs found for the given event.", 404);
            }

            sendSuccessResponse(response, "RSVP list retrieved successfully.", rsvps);
        } catch (error) {
            console.error("Error caught in route:", error); // Log error in the catch block
            handleRouteError(response, error, "Unable to retrieve RSVP list at this time, please try again later.", 500);
        }
    })
);




module.exports = router;