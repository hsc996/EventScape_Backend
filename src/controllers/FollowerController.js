const express = require("express");
const mongoose = require("mongoose");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    findOneFollower,
    isAlreadyFollowing
} = require("../utils/crud/FollowerCrud");
const { handleRoute, sendSuccessResponse } = require("../middleware/routerMiddleware.js");
const { AppError } = require("../functions/errorFunctions.js");
const { validateFollow } = require("../functions/helperFunctions.js");

const router = express.Router();


// See all followers for a single user

router.get(
    "/:userId/followers",
    handleRoute(async (request, response) => {
        const { userId } = request.params;

        const followers = await getFollowers(userId);

        if (!followers.length){
            throw new AppError("This user has no followers.", 404);
        }

        sendSuccessResponse(response, "Followers retrieved successfully.", followers);
    })
);




// See all following for a single user

router.get(
    "/:userId/following",
    handleRoute(async (request, response) => {
        const { userId } = request.params;

        const following = await getFollowing(userId);

        if (!following.length){
            throw new AppError("This user is not following anyone.", 404);
        }

        sendSuccessResponse(response, "Following list retrieved successfully.", following);
    })
);



// Follow Account

router.post(
    "/:userId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { userId: followingId } = request.params;
        const { userId: followerId } = request.authUserData;

        await validateFollow(followingId, followerId);

        const alreadyFollowing = await isAlreadyFollowing({ followerId, followingId });
        if (alreadyFollowing){
            throw new AppError("You are already following this user.", 400);
        }

        const newFollow = await followUser({ followerId, followingId });

        sendSuccessResponse(response, "Followed successfully.", newFollow);
    })
);





// Unfollow Account

router.delete(
    "/unfollow/:userId",
    validateUserAuth,
    handleRoute(async (request, response) => {
        const { userId: followingId } = request.params;
        const { userId: followerId } = request.authUserData;
    
        await validateFollow(followingId, followerId);

        const existingFollow = await findOneFollower({ followerId, followingId });
        if (!existingFollow){
            throw new AppError("You are not following this user.", 400);
        }

        const unfollow = await unfollowUser({ followerId, followingId });
        
        sendSuccessResponse(response, "User unfollowed successfully.", unfollow);
    })
);



module.exports = router;