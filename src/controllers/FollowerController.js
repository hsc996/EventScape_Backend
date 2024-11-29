const express = require("express");

const { validateUserAuth } = require("../middleware/validateUserAuth.js");
const { followUser, unfollowUser, getFollowers, getFollowing, findOneFollower } = require("../utils/crud/FollowerCrud");

const router = express.Router();


// See all followers for a single user
router.get("/:userId/followers", async (request, response) => {
    const { userId } = request.params;

    try {
        const followers = await getFollowers(userId);

        if (!followers.length){
            return response.status(404).json({
                message: "This user has no followers."
            });
        }

        response.status(200).json({
            message: "Followers retrieved successfully.",
            data: followers
        });
    } catch (error) {
        console.error("Error retrieving followers: ", error);
        return response.status(500).json({
            message: "An error occurred while retrieving followers. Please try again."
        });
    }
});




// See all following for a single user
router.get("/:userId/following", async (request, response) => {
    const { userId } = request.params;

    try {
        const following = await getFollowing(userId);

        if (!following.length){
            return response.status(404).json({
                message: "This user is not following anyone."
            });
        }

        response.status(200).json({
            message: "Following list retrieved successfully.",
            data: following
        });
    } catch (error) {
        
    }
});


// Follow Account
router.post("/:userId", validateUserAuth, async (request, response) => {
    const { userId: followingId } = request.params;
    const { userId: followerId } = request.authUserData;
    
    try {
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

        const newFollow = await followUser({ followerId, followingId });
        return response.status(200).json({
            message: "Followed successfully.",
            data: newFollow
        });

    } catch (error) {
        console.error("Error following user: ", error);
        return response.status(500).json({
            message: "An error occurred while trying to follow the user."
        });
    }
});




// Unfollow Account
router.delete("/unfollow/:userId", validateUserAuth, async (request, response) => {
    const { userId: followingId } = request.params;
    const { userId: followerId } = request.authUserData;
    
    try {
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
        return response.status(200).json({
            message: "User unfollowed successfully."
        });

    } catch (error) {
        console.error("Error following user: ", error);
        return response.status(500).json({
            message: "An error occurred while trying to follow the user."
        });
    }
});


module.exports = router;