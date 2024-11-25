const { UserModel } = require("../../models/UserModel.js");

async function createUser(username, email, password, isAdmin){
    try {

        let result = await UserModel.create({
            username: username,
            email: email,
            password: password,
            isAdmin: isAdmin
        });

        return result;

    } catch (error) {

        console.error("Error creating profile: ", error);
        throw new Error("Error creating profile, please try again.");

    }
}

async function findOneUser(query){
   try {
        let result = await UserModel.findOne(query);

        return result;
        
   } catch (error) {

        console.error("Error finding profile: ", error);
        throw new Error("Error finding profile, please try again.");

   }
}

async function findManyUsers(query){
    try {
        let result = await UserModel.find(query);

        return result;
    } catch (error) {
        console.error("Error finding profile list: ", error);
        throw new Error("Error finding profile list, please try again.")
    }
}

async function updateOneUser(query, updateData){
    try {
        let result = await UserModel.findOneAndUpdate(query, updateData, { new: true });

        return result
    } catch (error) {
        console.error("Error updating profile: ", error);
        throw new Error("Error updating profile, please try again.")
    }
}

async function deleteOneUser(query){
    try {
        let result = await UserModel.deleteOne(query);

        return result;
    } catch (error) {
        console.error("Error deleting profile", error);
        throw new Error("Error deleting profile, please try again.")
    }
}



module.exports = {
    createUser,
    findOneUser,
    findManyUsers,
    updateOneUser,
    deleteOneUser
}