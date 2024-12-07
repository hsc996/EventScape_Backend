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
const { UserModel } = require("../models/UserModel.js");

const router = express.Router();


// Find all active events user is attending

router.get(
    "/attending",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { userId } = request.authUserData;

        if (!userId){
            throw new AppError("User not found.", 404);
        }
    
        const result = await findActiveEventsForUser(userId);
    
        if (!result.length){
            throw new AppError("No active events found for this user.", 404);
        }
    
        sendSuccessResponse(response, "Active events retrieved successfully.", result);
    })
);


// View Event (Public)

router.get(
    "/public/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;

        let result = await findOneEvent({ _id: eventId });

        if (!result){
            throw new AppError("Event not found.", 404);
        }

        console.log("Event found: " + JSON.stringify(result));

        sendSuccessResponse(response, "Event retrieved successfully", result);
    }));


// View Private Event (Invite Only)

router.get(
    "/private/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { userId } = request.authUserData;

        let result = await findPrivateEvent(eventId, userId);

        sendSuccessResponse(response, "Event retrieved successfully", result);
    })
);



// Create Event

router.post(
    "/create",
    validateUserAuth,
    handleRoute(async (request, response) => {
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
    })
);



// Update Event

router.patch(
    "/update/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
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
    })
);



// Delete Event

router.delete(
    "/delete/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;

        let result = await deleteOneEvent({_id: eventId});

        if (!result){
            throw new AppError("Event not found.", 404);
        }

        console.log("Event with ID " + JSON.stringify(result) + "deleted successfully.");

        sendSuccessResponse(response, "Event data deleted successfully.", result);
    })
);


// Invite Followers to Event

router.post(
    "/invite/:eventId",
    validateUserAuth,
    checkEventPermission,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;
        const { userId } = request.authUserData;

        const event = await findOneEvent({ _id: eventId });
        if (!event){
            throw new AppError("Event not found.", 404);
        }

        if (event.host.toString() !== userId){
            throw new AppError("You are not authorised to invite other users to this event.", 403);
        }

        const host = await UserModel.findById(userId).select("followers");
        if (!host || !host.followers.length){
            throw new AppError("You have no followers to invite.", 404);
        }

        const uniqueInvite = Array.from(
            new Set([...event.invited.map((id) => id.toString()), ...host.followers.map((id) => id.toString())])
        );

        event.invited = uniqueInvited;
        await event.save();

        sendSuccessResponse(response, `Followers invited successfully.`, {
            eventId: event._id,
            invited: event.invited
        });
    })
);

module.exports = router;