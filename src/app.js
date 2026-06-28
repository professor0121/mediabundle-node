import express from "express";
import path from "path";

const app = express();

// Use process.cwd() to resolve paths reliably both locally and in serverless environments like Vercel
const publicPath = path.join(process.cwd(), "public");

// Serve static files from the public folder and support clean URLs (.html extension)
app.use(express.static(publicPath, {
    extensions: ["html", "htm"]
}));

// Fallback to 404.html for any unmatched routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicPath, "404.html"));
});

export default app;