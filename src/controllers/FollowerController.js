const express = require("express");

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
const { AppError } = require("../functions/helperFunctions.js");

const router = express.Router();


// See all followers for a single user
router.get(
    "/:userId/followers",
    handleRoute(async (request, response) => {
        const { userId } = request.params;

        const followers = await getFollowers(userId);

        if (!followers.length){
            return response.status(404).json({
                message: "This user has no followers."
            });
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
            return response.status(404).json({
                message: "This user is not following anyone."
            });
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
    
        if (!followingId){
            return response.status(404).json({
                message: `User with ID ${followingId} not found.`
            })
        }

        if (followingId === followerId){
            return response.status(400).json({
                message: "You cannot follow yourself."
            })
        }

        const alreadyFollowing = await isAlreadyFollowing({ followerId, followingId });
        if (alreadyFollowing){
            return response.status(400).json({
                message: "You are already following this user."
            })
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
    
        if (!followingId){
            return response.status(404).json({
                message: `User with ID ${followingId} not found.`
            })
        }

        if (followingId === followerId){
            return response.status(400).json({
                message: "You cannot unfollow yourself."
            })
        }

        const existingFollow = await findOneFollower({ followerId, followingId });
        if (!existingFollow){
            return response.status(400).json({
                message: "You are not following this user."
            });
        }

        const unfollow = await unfollowUser({ followerId, followingId });
        
        sendSuccessResponse(response, "User unfollowed successfully.", unfollow);
    })
);



module.exports = router;