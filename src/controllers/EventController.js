const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    createEvent,
    findOneEvent,
    updateOneEvent,
    deleteOneEvent,
    findActiveEventsForUser,
    findPrivateEvent
} = require("../utils/crud/EventCrud.js");
const { handleRoute, sendSuccessResponse, checkEventPermission } = require("../middleware/routerMiddleware.js");
const { AppError, handleRouteError } = require("../functions/helperFunctions.js");

const router = express.Router();


// Find all active events user is attending

router.get(
    "/attending",
    validateUserAuth,
    handleRoute(async (request, response) => {
        try {
            const { userId } = request.authUserData;

            if (!userId){
                throw new AppError("User not found.", 404);
            }
        
            const result = await findActiveEventsForUser(userId);
        
            if (!result.length){
                throw new AppError("No active events found for this user.", 404);
            }
        
            sendSuccessResponse(response, "Active events retrieved successfully.", result);
        } catch (error) {
            handleRouteError(response, error, "Error retrieving active events for this user, please try again later.");
        }
    })
);


// View Event (Public)

router.get(
    "/public/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        try {
            const { eventId } = request.params;

            let result = await findOneEvent({ _id: eventId });

            if (!result){
                throw new AppError("Event not found.", 404);
            }

            console.log("Event found: " + JSON.stringify(result));

            sendSuccessResponse(response, "Event retrieved successfully", result);

        } catch (error) {
            handleRouteError(response, error, "Error retrieving event, please try again later.");
        }
    }));


// View Private Event (Invite Only)

router.get(
    "/private/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        try {
            const { eventId } = request.params;
            const { userId } = request.authUserData;

            let result = await findPrivateEvent(eventId, userId);

            sendSuccessResponse(response, "Event retrieved successfully", result);

        } catch (error) {
            handleRouteError(response, error, "Error retrieving event, please try again later.");
        }
    })
);



// Create Event

router.post(
    "/create",
    validateUserAuth,
    handleRoute(async (request, response) => {
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
                throw new AppError("Please complete all of the required fields.", 400);
            }
    
            if (new Date(eventDate) <= new Date()) {
                throw new AppError("Event date must be in the future.", 400);
            }
    
            if (location.trim().length < 3) {
                throw new AppError("Location must be at least 3 characters long.", 400);
            }

            let newEvent = await createEvent(eventName, description, eventDate, location, host, attendees);

            console.log(`Event created successfully: ${newEvent.eventName} at ${newEvent.location}`);

            sendSuccessResponse(response, "Event created successfully.", {
                id: newEvent._id,
                eventName: newEvent.eventName,
                description: newEvent.description,
                eventDate: newEvent.eventDate,
                location: newEvent.location,
                host: newEvent.host,
                attendees: newEvent.attendees,
            });

        } catch (error) {
            handleRouteError(response, error, "An error occurred while creating the event, please try again later.");
        }
    })
);



// Update Event

router.patch(
    "/update/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
        try {
            const { eventId } = request.params;
            const updateData = request.body;

            if (!eventId){
                throw new AppError("Event not found.", 404);
            }

            const updatedEvent = await updateOneEvent(
                {_id: eventId},
                updateData
            );

            if (!updatedEvent){
                throw new AppError("Event not found or could not be updated.", 404);
            }

            sendSuccessResponse(response, "Event data updated successfully.", updatedEvent);

        } catch (error) {
            handleRouteError(response, error, "Event could not be updated at this time, please try again later.");
        }
    })
);



// Delete
router.delete(
    "/delete/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
        try {
            const { eventId } = request.params;

            let result = await deleteOneEvent({_id: eventId});

            if (!result){
                throw new AppError("Event not found.", 404);
            }

            console.log("Event with ID " + JSON.stringify(result) + "deleted successfully.");

            sendSuccessResponse(response, "Event data deleted successfully.", result)

        } catch (error) {
            handleRouteError(response, error, "Event could not be deleted at this time, please try again later.");
        }
    })
);


module.exports = router;