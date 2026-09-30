const mongoose = require('mongoose');
const uri = "mongodb+srv://abhiudayasingh2005_db_user:LeVySg9eeLldCrO2@cluster0.4n3gd6t.mongodb.net/leadpilot?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
    try {
        console.log("Connecting...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS! Authenticated Locally!");
        process.exit(0);
    } catch (e) {
        console.log("FAILED STRUC: " + e.message);
        process.exit(1);
    }
}
run();
