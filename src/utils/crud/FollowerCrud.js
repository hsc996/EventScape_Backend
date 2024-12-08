const { FollowerModel } = require("../../models/FollowerModel.js");

// Find a follower
async function findOneFollower(query){
    try {
        const follow = await FollowerModel.findOne({ followerId: query.followerId })
            .populate("followerId")
            .populate("followingId");
        return follow;
    } catch (error) {
        console.error("Error finding follow relationship: ", error);
        throw new Error("Error finding follow relationship, please try again.");
    }
}


// Get followers

async function getFollowers(query){
    try {
        const followers = await FollowerModel.find({ followingId: query })
            .populate("followerId");
        return followers;
    } catch (error) {
        console.error("Error retrieving followers list: ", error);
        throw new Error("Error retrieving followers list, please try again.");
    }
}

// Get following

async function getFollowing(query){
    try {
        const following = await FollowerModel.find({ followerId: query })
            .populate("followingId");
        return following;
    } catch (error) {
        console.error("Error retrieving following list: ", error);
        throw new Error("Error retrieving following list, please try again.");
    }
}

// Follow User

async function followUser(query){
    try {
        const newFollow = new FollowerModel(query);
        const savedFollow = await newFollow.save();

        return savedFollow;
    } catch (error) {
        console.error("Error following user.");
        throw new Error("Error following user, please try again.");
    }
}

// Unfollow User

async function unfollowUser(query){
    try {
        const unfollow = FollowerModel.findOneAndDelete(query);

        return unfollow;
    } catch (error) {
        console.error("Error unfollowing user: ", error);
        throw new Error("Error unfollowing user, please try again.");
    }
}

// Checks if user is alreasdy following

async function isAlreadyFollowing(followerId, followingId){
    try {
        const existingFollow = await FollowerModel.findOne({
            follower: followerId,
            following: followingId
        });

        return !!existingFollow;
    } catch (error) {
        console.error("Error checking follow status: ", error);
        throw new Error("Error checking follow status, please try again.");
    }
}

module.exports = {
    findOneFollower,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    isAlreadyFollowing
}