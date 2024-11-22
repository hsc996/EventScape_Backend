const mongoose = require("mongoose");

async function dbConnect(){
    let databaseUrl = process.env.DATABASE_URL || `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;
    await mongoose.connect(databaseURL);
    console.log("Connected to database at " + databaseUrl)
}

async function dbDisconnect(){
    await mongoose.connection.close();
}

module.exports = {
    dbConnect,
    dbDisconnect
}