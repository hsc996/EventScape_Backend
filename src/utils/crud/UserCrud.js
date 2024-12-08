const { UserModel } = require("../../models/UserModel.js");


// Sign up route - accessed by Auth Controllers

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

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error creating profile, please try again later.", 500);
    }
}


// Get one user - accessed by User Controller

async function findOneUser(query){
   try {
        let result = await UserModel.findOne(query);

        return result;
   } catch (error) {
        console.error("Error finding profile: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error finding profile, please try again later.", 500);
   }
}


// Get many users - accessed by User Controllers

async function findManyUsers(query){
    try {
        let result = await UserModel.find(query);

        return result;
    } catch (error) {
        console.error("Error finding profile list: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error finding profile list, please try again later.", 500);
    }
}


// Update user profile  - accessed by User Controllers

async function updateOneUser(query, updateData){
    try {
        let result = await UserModel.findOneAndUpdate(query, updateData, { new: true });

        return result
    } catch (error) {
        console.error("Error updating profile: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error updating profile, please try again later.", 500);
    }
}


// Delete user profile - accessed by User Controllers

async function deleteOneUser(query){
    try {
        let result = await UserModel.deleteOne(query);

        return result;
    } catch (error) {
        console.error("Error deleting profile: ", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Error deleting profile, please try again later.", 500);
    }
}



module.exports = {
    createUser,
    findOneUser,
    findManyUsers,
    updateOneUser,
    deleteOneUser
}