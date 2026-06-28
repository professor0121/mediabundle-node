import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mediabundle";

let connectionInstance = null;

const connectDB = async () => {
    // 1. If we already have the connection instance cached in memory, reuse it
    if (connectionInstance) {
        console.log("Reusing existing MongoDB connection instance.");
        return connectionInstance;
    }

    // 2. Double check mongoose's readyState to avoid multiple connections
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
        throw error; // Throwing error so that index.js can catch it and handle startup failure
    }
};

export default connectDB;
