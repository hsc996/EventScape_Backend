const { dbConnect, dbDisconnect } = require('../functions/dbFunctions.js');
const { UserModel } = require('../models/UserModel.js');
const { EventModel } = require('../models/EventModel.js');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require('dotenv').config();

async function dropAndSeed(){
    try {

        await UserModel.deleteMany({});
        await EventModel.deleteMany({});
        console.log("Old users and events deleted.")

        const users = [
            {
                username: "Admin",
                email: "admin@gmail.com",
                password: "Password123!",
                isAdmin: true
            },
            {
                username: "User2",
                email: "usertwo@gmail.com",
                password: "Password456!",
                isAdmin: false
            },
            {
                username: "User3",
                email: "userthree@gmail.com",
                password: "Password789!",
                isAdmin: false
            }
        ];

        for (let user of users){
            user.password = await bcrypt.hash(user.password, 10);
        }

        const insertedUsers = await UserModel.insertMany(users);
        console.log("Users seeded successfully.")

        const attendeeIds = insertedUsers.map(user => user._id);
        const hostIds = attendeeIds[0];

        const events = [
            {
                eventName: "Dog Wedding",
                description: "Please join us to celebrate the long-awaited union of Fluffy and Rocket.",
                eventDate: new Date('2024-12-05T15:00:00Z'),
                location: "Hyde Park, Sydney CBD",
                host: hostIds,
                attendees: attendeeIds,
                isActive: true
            },
            {
                eventName: "Sam's 21st Birthday",
                description: "Come celebrate Sam's milestone birthday! There will be cake, drinks, and lots of fun. Don't miss it!",
                eventDate: new Date('2024-12-18T19:00:00Z'),
                location: 'Sam\'s House, Los Angeles, CA',
                host: hostIds,
                attendees: attendeeIds,
                isActive: true
            },
            {
                eventName: 'Family Barbecue',
                description: 'Join us for a casual family BBQ with lots of food, drinks, and games. Bring your loved ones and enjoy!',
                eventDate: new Date('2024-12-25T12:00:00Z'),
                location: 'Grandma\'s Backyard, Chicago, IL',
                host: hostIds,
                attendees: attendeeIds,
                isActive: true
            }
        ];

        await EventModel.insertMany(events);

        console.log("Database seeded successfully.");

    } catch (error) {
        console.log("Error seeding database: ", error);
    } finally {
        await dbDisconnect();
        process.exit();
    }
}

dbConnect()
.then(() => {
    console.log("Connected to database, seeding in progress.");
    dropAndSeed();
})
.catch((error) => {
    console.log("Error connecting to database: ", error);
})