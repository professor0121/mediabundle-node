import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Setup standard middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Use process.cwd() to resolve paths reliably both locally and in serverless environments like Vercel
const publicPath = path.join(process.cwd(), "public");

// Register API Routes
app.use("/api/v1", apiRouter);

// Serve static files from the public folder and support clean URLs (.html extension)
app.use(express.static(publicPath, {
    extensions: ["html", "htm"]
}));

// Global Error Handler Middleware
app.use(errorMiddleware);

// Fallback to 404.html for any unmatched routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicPath, "404.html"), (err) => {
        if (err) {
            // Fallback if the static 404 file is not bundled in the serverless environment
            res.status(404).send("<h1>404 Not Found</h1>");
        }
    });
});

export default app;