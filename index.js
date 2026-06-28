import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

import { configDotenv } from 'dotenv';
configDotenv();

// Establish database connection (runs asynchronously in serverless environments)
connectDB().catch((error) => {
    console.error('Database connection failed:', error);
});

const server = http.createServer(app);

// Only listen on a port if we are not running on Vercel
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});