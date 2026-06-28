import app from "../src/app.js";
import connectDB from "../src/config/db.js";

// Establish database connection (runs asynchronously in serverless environments)
connectDB().catch((error) => {
    console.error("Database connection failed:", error);
});

// Export the Express app as the default handler for Vercel
export default app;
