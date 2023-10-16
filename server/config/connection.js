require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the environment variable for the MongoDB connection string
        const MONGO_URI = process.env.MONGO_URI;

        if (!MONGO_URI) {
            throw new Error("MongoDB URI not found in environment variables.");
        }

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message || err);
        process.exit(1);
    }
};

module.exports = connectDB;
