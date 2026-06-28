import mongoose from "mongoose";

// Only default to localhost if we are not running on Vercel (serverless environment)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || (!process.env.VERCEL ? "mongodb://127.0.0.1:27017/mediabundle" : null);

let connectionInstance = null;

const connectDB = async () => {
    // 1. If MONGO_URI is not defined (e.g. on Vercel without environment variables configured), skip connection
    if (!MONGO_URI) {
        console.warn("Database connection skipped: MONGO_URI / MONGODB_URI environment variable is not defined on Vercel.");
        return null;
    }

    // 2. If we already have the connection instance cached in memory, reuse it
    if (connectionInstance) {
        console.log("Reusing existing MongoDB connection instance.");
        return connectionInstance;
    }

    // 3. Double check mongoose's readyState to avoid multiple connections
    // (1 = connected, 2 = connecting)
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        console.log("Mongoose is already connected or connecting. Reusing connection.");
        connectionInstance = mongoose.connection;
        return connectionInstance;
    }

    try {
        console.log("Establishing new MongoDB connection...");
        const connection = await mongoose.connect(MONGO_URI);
        connectionInstance = connection;
        console.log(`MongoDB connected: ${connection.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

export default connectDB;
