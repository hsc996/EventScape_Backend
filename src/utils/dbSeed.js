const { dbConnect, dbDisconnect } = require('../functions/dbFunctions.js');
const { UserModel } = require('../models/UserModel.js');
const { createUser } = require('./crud/UserCrud.js')

require('dotenv').config();

async function seed(){
    try {
        const users = [
            {
                username: "Admin",
                email: "admin@gmail.com",
                password: "Password123",
                isAdmin: true
            },
            {
                username: "User2",
                email: "usertwo@gmail.com",
                password: "Password456",
                isAdmin: false
            },
            {
                username: "User3",
                email: "userthree@gmail.com",
                password: "Password789",
                isAdmin: false
            }
        ];

        await UserModel.insertMany(users);
        console.log("Database seeded successfully.")
    } catch (error) {
        console.log("Error seeding database: ", error);
    } finally {
        process.exit()
    }
}

dbConnect().then(() => {
    console.log("Connected to database, seeding in progress.");
    seed();
});