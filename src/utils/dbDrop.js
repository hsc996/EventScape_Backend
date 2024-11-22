const { dbConnect, dbDrop, dbDisconnect } = require('../functions/dbFunctions');

async function drop(){
    await dbDrop();

    console.log("Database dropped, disconnecting from database.")

    await dbDisconnect();
}

dbConnect().then(() => {
    console.log("Connected to database.");
    drop();
})