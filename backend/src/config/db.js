const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB connection natively cached.');
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error('FATAL SYSTEM HALT: Missing MONGODB_URI environment variable.');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB Cluster Connection Handshake Operational.');
    } catch (error) {
        console.error('MongoDB database thread initialization error:', error.message);
        throw error;
    }
};

module.exports = connectDB;
