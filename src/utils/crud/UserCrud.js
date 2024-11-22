const { UserModel } = require("../../models/UserModel.js");

async function createUser(username, email, password, isAdmin){
    let result = await UserModel.create({
        username: username,
        email: email,
        password: password,
        isAdmin: isAdmin
    });

    return result;
}

async function findOneUser(query){
    let result = await UserModel.findOne(query);

    return result;
}

async function findManyUsers(query){
    let result = await UserModel.find(query);

    return result;
}

async function updateOneUser(query, updateData){
    let result = await UserModel.findOneAndUpdate(query, updateData, { new: true });

    return result
}

async function deleteOneUser(){

}



module.exports = {
    createUser,
    findOneUser,
    findManyUsers,
    updateOneUser
}