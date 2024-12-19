const express = require("express");
const mongoose = require("mongoose");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    createEvent,
    findOneEvent,
    updateOneEvent,
    deleteOneEvent,
    findActiveEventsForUser,
    findPrivateEvent,
    findAllHostEvents
} = require("../utils/crud/EventCrud.js");
const { handleRoute, sendSuccessResponse, checkEventPermission } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/errorFunctions.js");
const { isValidObjectId } = require("mongoose");
const { validateEventData } = require("../functions/validationFunctions.js");
const { FollowerModel } = require("../models/FollowerModel");

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


// Find all active events the user is hosting

router.get("/hosting", validateUserAuth, handleRoute(async (request, response) => {
    const { userId } = request.authUserData;

    if (!userId){
        throw new AppError("User not found.", 404);
    }

    const result = await findAllHostEvents(userId);

    if (!result.length){
        throw new AppError("No active events found hosted by this user.", 404);
    }

    sendSuccessResponse(response, "Active events hosted by this user retrieved successfully.", result);
}))


// View Event (Public)

router.get(
    "/public/:eventId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { eventId } = request.params;

        if (!isValidObjectId(eventId)) {
            throw new AppError("Invalid event ID format.", 400);
        }

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

        if (!isValidObjectId(eventId)) {
            throw new AppError("Invalid event ID format.", 400);
        }

        let result = await findPrivateEvent(eventId, userId);

        if (!result) {
            throw new AppError("Private event not found or user not authorised.", 403);
        }

        sendSuccessResponse(response, "Event retrieved successfully", result);
    })
);



// Create Event

router.post(
    "/create",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { userId: host } = request.authUserData
        const {
            eventName,
            description,
            eventDate,
            location,
            invited,
            theme
        } = request.body;

        validateEventData({ eventName, description, eventDate, location, host, invited, theme });

        let newEvent = await createEvent(eventName, description, eventDate, location, host, invited, theme);

        sendSuccessResponse(response, "Event created successfully.", {
            id: newEvent._id,
            eventName: newEvent.eventName,
            description: newEvent.description,
            eventDate: newEvent.eventDate,
            location: newEvent.location,
            host: newEvent.host,
            invited: newEvent.invited,
            theme: newEvent.theme
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

        if (!isValidObjectId(eventId)) {
            throw new AppError("Invalid event ID format.", 400);
        }

        const allowedUpdates = ["eventName", "description", "eventDate", "location", "invited"];
        const invalidFields = Object.keys(updateData).filter(key => !allowedUpdates.includes(key));

        if (invalidFields.length) {
            throw new AppError(`Invalid fields for update: ${invalidFields.join(", ")}`, 400);
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

        if (!isValidObjectId(eventId)) {
            throw new AppError("Invalid event ID format.", 400);
        }

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
        const { invitedUserIds } = request.body;

        if (!isValidObjectId(eventId)) {
            throw new AppError("Invalid event ID format.", 400);
        }

        const event = await findOneEvent({ _id: eventId });
        if (!event){
            throw new AppError("Event not found.", 404);
        }

        if (event.host.toString() !== userId){
            throw new AppError("You are not authorised to invite other users to this event.", 403);
        }

        const hostFollowers = await FollowerModel.find({ followingId: userId }).select("followerId");

        if (!hostFollowers || hostFollowers.length === 0) {
            throw new AppError("You have no followers to invite.", 404);
        }

        const followerIds = hostFollowers.map(follower => follower.followerId.toString());
        console.log("Host followers:", followerIds);

        const validInvitedUserIds = invitedUserIds.filter(id => followerIds.includes(id.toString()));

        if (validInvitedUserIds.length === 0) {
            throw new AppError("None of the selected users are in your followers list.", 400);
        }

        const uniqueInvite = Array.from(
            new Set([...event.invited.map(id => id.toString()), ...validInvitedUserIds])
        );

        event.invited = uniqueInvite;
        await event.save();

        sendSuccessResponse(response, "Followers invited successfully.", {
            eventId: event._id,
            invited: event.invited
        });
    })
);


module.exports = router;