import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ejs from "ejs";
import apiRouter from "./routes/index.js";
import pageRouter from "./routes/page.routes.js";
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

// Configure EJS view engine for rendering HTML templates server-side
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", publicPath);

// Register API Routes
app.use("/api/v1", apiRouter);

// Register Page Views Router (SSR)
app.use("/", pageRouter);

// Serve static files from the public folder (CSS, JS, images, etc.)
app.use(express.static(publicPath, { extensions: ["html"] }));

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