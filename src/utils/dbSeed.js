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
            },
            {
                username: "User4",
                email: "userfour@gmail.com",
                password: "Password00!",
                isAdmin: false,
                followers: [],
                following: []
            },
            {
                username: "User5",
                email: "userfive@gmail.com",
                password: "Password11!",
                isAdmin: false,
                followers: [],
                following: []
            },
            {
                username: "User6",
                email: "usersix@gmail.com",
                password: "Password44!",
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


        const followData = [
            { followerId: insertedUsers[0]._id, followingId: insertedUsers[1]._id },
            { followerId: insertedUsers[0]._id, followingId: insertedUsers[2]._id },
            { followerId: insertedUsers[1]._id, followingId: insertedUsers[0]._id },
            { followerId: insertedUsers[1]._id, followingId: insertedUsers[2]._id },
            { followerId: insertedUsers[2]._id, followingId: insertedUsers[0]._id },
            { followerId: insertedUsers[2]._id, followingId: insertedUsers[1]._id },
            { followerId: insertedUsers[3]._id, followingId: insertedUsers[4]._id },
            { followerId: insertedUsers[3]._id, followingId: insertedUsers[5]._id },
            { followerId: insertedUsers[4]._id, followingId: insertedUsers[3]._id },
            { followerId: insertedUsers[4]._id, followingId: insertedUsers[5]._id },
            { followerId: insertedUsers[5]._id, followingId: insertedUsers[3]._id },
            { followerId: insertedUsers[5]._id, followingId: insertedUsers[4]._id },
            { followerId: insertedUsers[0]._id, followingId: insertedUsers[5]._id },
            { followerId: insertedUsers[1]._id, followingId: insertedUsers[4]._id },
            { followerId: insertedUsers[2]._id, followingId: insertedUsers[5]._id },
            { followerId: insertedUsers[3]._id, followingId: insertedUsers[0]._id },
            { followerId: insertedUsers[4]._id, followingId: insertedUsers[1]._id },
            { followerId: insertedUsers[5]._id, followingId: insertedUsers[2]._id }
        ];

        await FollowerModel.insertMany(followData);
        console.log("Followers seeded successfully.");

        const events = [
            {
                eventName: "Dog Wedding",
                description: "Please join us to celebrate the long-awaited union of Fluffy and Rocket.",
                eventDate: new Date('2024-12-05T15:00:00Z'),
                location: "Hyde Park, Sydney CBD",
                host: insertedUsers[0]._id,
                invited: [insertedUsers[1]._id, insertedUsers[2]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Sam's 21st Birthday",
                description: "Come celebrate Sam's milestone birthday! There will be cake, drinks, and lots of fun. Don't miss it!",
                eventDate: new Date('2024-12-18T19:00:00Z'),
                location: 'Sam\'s House, Los Angeles, CA',
                host: insertedUsers[1]._id,
                invited: [insertedUsers[0]._id, insertedUsers[2]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: 'Family Barbecue',
                description: 'Join us for a casual family BBQ with lots of food, drinks, and games. Bring your loved ones and enjoy!',
                eventDate: new Date('2024-12-25T12:00:00Z'),
                location: 'Grandma\'s Backyard, Chicago, IL',
                host: insertedUsers[2]._id,
                invited: [insertedUsers[0]._id, insertedUsers[1]._id],
                isPublic: false,
                isActive: true
            },
            {
                eventName: "Tech Innovation Meetup",
                description: "A gathering of developers and tech enthusiasts to discuss the latest trends in technology, including AI, blockchain, and quantum computing.",
                eventDate: new Date('2024-12-10T10:00:00Z'),
                location: "Innovation Hub, San Francisco, CA",
                host: insertedUsers[3]._id,
                invited: [insertedUsers[0]._id, insertedUsers[1]._id, insertedUsers[2]._id, insertedUsers[4]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Christmas Eve Party",
                description: "Celebrate the holidays with friends and family at our Christmas Eve party! Expect great music, food, and festive cheer.",
                eventDate: new Date('2024-12-24T20:00:00Z'),
                location: "The Smith's House, New York, NY",
                host: insertedUsers[4]._id,
                invited: [insertedUsers[0]._id, insertedUsers[1]._id, insertedUsers[3]._id],
                isPublic: false,
                isActive: true
            },
            {
                eventName: "New Year’s Eve Bash",
                description: "Join us for a spectacular New Year’s Eve celebration with fireworks, music, and dancing as we ring in the new year together!",
                eventDate: new Date('2024-12-31T22:00:00Z'),
                location: "Sky Lounge, Los Angeles, CA",
                host: insertedUsers[5]._id,
                invited: [insertedUsers[0]._id, insertedUsers[1]._id, insertedUsers[2]._id, insertedUsers[3]._id, insertedUsers[4]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Global Music Festival",
                description: "Join thousands of music lovers for a three-day festival featuring international bands, DJs, and live performances.",
                eventDate: new Date('2025-01-05T12:00:00Z'),
                location: "Central Park, New York, NY",
                host: insertedUsers[0]._id,
                invited: [insertedUsers[1]._id, insertedUsers[2]._id, insertedUsers[3]._id, insertedUsers[4]._id, insertedUsers[5]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "AI for Beginners Workshop",
                description: "A hands-on workshop for anyone interested in learning the basics of Artificial Intelligence, Machine Learning, and its applications in real-world projects.",
                eventDate: new Date('2025-01-10T09:00:00Z'),
                location: "Tech Conference Hall, San Francisco, CA",
                host: insertedUsers[1]._id,
                invited: [insertedUsers[0]._id, insertedUsers[2]._id, insertedUsers[4]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Virtual Startup Pitch Night",
                description: "Startups pitch their innovative ideas to investors in a fast-paced virtual environment. Tune in for exciting new tech ideas and networking opportunities.",
                eventDate: new Date('2025-01-15T18:00:00Z'),
                location: "Online",
                host: insertedUsers[3]._id,
                invited: [insertedUsers[0]._id, insertedUsers[2]._id, insertedUsers[4]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Design Thinking Workshop",
                description: "A creative workshop focusing on the principles of Design Thinking to solve complex problems and create user-centered solutions.",
                eventDate: new Date('2025-01-20T10:00:00Z'),
                location: "Creative Lab, Los Angeles, CA",
                host: insertedUsers[4]._id,
                invited: [insertedUsers[0]._id, insertedUsers[1]._id, insertedUsers[3]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Blockchain Conference",
                description: "A global conference where industry experts discuss the future of Blockchain technology, cryptocurrency trends, and its impact on various sectors.",
                eventDate: new Date('2025-02-05T09:00:00Z'),
                location: "Convention Center, Chicago, IL",
                host: insertedUsers[2]._id,
                invited: [insertedUsers[0]._id, insertedUsers[1]._id, insertedUsers[3]._id, insertedUsers[5]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Art Exhibition: Modern Art",
                description: "Explore the world of modern art in this exclusive exhibition.",
                eventDate: new Date("2024-12-10T15:00:00Z"),
                location: "Gallery 1, Downtown",
                host: insertedUsers[1]._id,
                invited: [insertedUsers[0]._id, insertedUsers[2]._id],
                isPublic: true,
                isActive: true
            },
            {
                eventName: "Sculpture Workshop",
                description: "Join us for a hands-on sculpture workshop by renowned artists.",
                eventDate: new Date("2024-12-12T09:00:00Z"),
                location: "Art Center, Central Park",
                host: insertedUsers[2]._id, 
                invited: [insertedUsers[0]._id, insertedUsers[1]._id, insertedUsers[3]._id],
                isPublic: true,
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