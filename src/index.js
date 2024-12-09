require("dotenv").config();

const { dbConnect } = require('./functions/dbFunctions.js');
const { app } = require('./server');

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await dbConnect();
    console.log("Server is running on port http://localhost:" + PORT);
});

