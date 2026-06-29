import app from "../src/app.js";
import connectDB from "../src/config/db.js";

// Establish database connection (runs asynchronously in serverless environments)
connectDB().catch((error) => {
    console.error("Database connection failed in serverless entry:", error);
});

export default app;
