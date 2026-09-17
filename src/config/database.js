const mongoose = require('mongoose');

require('dotenv').config();
const DBSTRING = process.env.DBSTRING;

const connectDB = async () => {
    try {
        console.log('connecting to data base...');
        await mongoose.connect(DBSTRING, {
            serverSelectionTimeoutMS: 30000, // give it up to 30s instead of default ~10s
        });
        console.log("connection to database established ✅");

        mongoose.connection.on('disconnected', () => {
            console.warn('DB disconnected. Attempting reconnection');
        });
        mongoose.connection.on('reconnected', () => {
            console.info('DB reconnected');
        });
        mongoose.connection.on('error', (err) => {
            console.error('DB connection err:', err);
        });

    } catch (err) {
        console.error("Error connecting to db:", err);
        process.exit(1); // exit only after all attempts fail — nothing after this runs
    }
};

module.exports = connectDB;