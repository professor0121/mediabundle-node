import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the public folder and support clean URLs (.html extension)
app.use(express.static(path.join(__dirname, "../public"), {
    extensions: ["html", "htm"]
}));

// Fallback to 404.html for any unmatched routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

export default app;