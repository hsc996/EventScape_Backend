const { dbConnect, dbDisconnect } = require('../functions/dbFunctions.js');
const { UserModel } = require('../models/UserModel.js');
const { EventModel } = require('../models/EventModel.js');
const { RSVPModel } = require('../models/RSVPModel.js');
const { FollowerModel } = require("../models/FollowerModel.js");
const { ThemeTemplateModel } = require("../models/ThemeModel.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require('dotenv').config();

async function dropAndSeed(){
    try {

        await UserModel.deleteMany({});
        await EventModel.deleteMany({});
        await RSVPModel.deleteMany({});
        await FollowerModel.deleteMany({});
        await ThemeTemplateModel.deleteMany({});
        
        console.log("Old collections deleted.")

        const users = [
            {
                username: "Admin",
                email: "admin@gmail.com",
                password: "Password123!",
                isAdmin: true,
                followers: [],
                following: []
            },
            {
                username: "User2",
                email: "usertwo@gmail.com",
                password: "Password456!",
                isAdmin: false,
                followers: [],
                following: []
            },
            {
                username: "User3",
                email: "userthree@gmail.com",
                password: "Password789!",
                isAdmin: false,
                followers: [],
                following: []
            }
        ];

        for (let user of users){
            user.password = await bcrypt.hash(user.password, 10);
        }

        const insertedUsers = await UserModel.insertMany(users);
        console.log("Users seeded successfully.");

                const admin = insertedUsers[0];
                const user2 = insertedUsers[1];
                const user3 = insertedUsers[2];
        
                admin.following = [user2._id, user3._id];
                user2.followers = [admin._id];
        
                user2.following = [user3._id];
                user3.followers = [user2._id];
        
                user3.followers.push(admin._id);
        
                await admin.save();
                await user2.save();
                await user3.save();
        
                console.log("Followers and following relationships updated successfully.");

        const attendeeIds = insertedUsers.map(user => user._id);

        const events = [
            {
                eventName: "Dog Wedding",
                description: "Please join us to celebrate the long-awaited union of Fluffy and Rocket.",
                eventDate: new Date('2024-12-05T15:00:00Z'),
                location: "Hyde Park, Sydney CBD",
                host: attendeeIds[0],
                attendees: attendeeIds,
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Sam's 21st Birthday",
                description: "Come celebrate Sam's milestone birthday! There will be cake, drinks, and lots of fun. Don't miss it!",
                eventDate: new Date('2024-12-18T19:00:00Z'),
                location: 'Sam\'s House, Los Angeles, CA',
                host: attendeeIds[1],
                attendees: attendeeIds,
                isPublic: true,
                isActive: true
            },
            {
                eventName: 'Family Barbecue',
                description: 'Join us for a casual family BBQ with lots of food, drinks, and games. Bring your loved ones and enjoy!',
                eventDate: new Date('2024-12-25T12:00:00Z'),
                location: 'Grandma\'s Backyard, Chicago, IL',
                host: attendeeIds[2],
                attendees: attendeeIds,
                isPublic: false,
                isActive: true
            }
        ];

        const insertedEvents = await EventModel.insertMany(events);
        console.log("Events seeded successfully.");

        // Seed RSVPs
        const rsvpData = [
            {
                eventId: insertedEvents[0]._id,
                userId: insertedUsers[0]._id,
                status: "yes"
            },
            {
                eventId: insertedEvents[0]._id,
                userId: insertedUsers[1]._id,
                status: "maybe"
            },
            {
                eventId: insertedEvents[1]._id,
                userId: insertedUsers[2]._id,
                status: "no"
            },
            {
                eventId: insertedEvents[2]._id,
                userId: insertedUsers[1]._id,
                status: "yes"
            },
            {
                eventId: insertedEvents[2]._id,
                userId: insertedUsers[0]._id,
                status: "maybe"
            }
        ];

        await RSVPModel.insertMany(rsvpData);
        console.log("RSVPs seeded successfully.");

        const followData = [
            {
                followerId: insertedUsers[0]._id,
                followingId: insertedUsers[1]._id
            },
            {
                followerId: insertedUsers[1]._id,
                followingId: insertedUsers[2]._id
            },
            {
                followerId: insertedUsers[2]._id,
                followingId: insertedUsers[1]._id
            }
        ];

        const themes = [
            {
                themeName: "Light Theme",
                description: "A light and bright theme for daytime use.",
                styles: {
                    backgroundColor: "#ffffff",
                    color: "#000000"
                }
            },
            {
                themeName: "Dark Theme",
                description: "A dark theme suitable for low-light environments.",
                styles: {
                    backgroundColor: "#333333",
                    color: "#ffffff"
                }
            }
        ];

        await ThemeTemplateModel.insertMany(themes);
        console.log("Themes seeded successfully.");

        await FollowerModel.insertMany(followData);
        console.log("Followers seeded successfully.");

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