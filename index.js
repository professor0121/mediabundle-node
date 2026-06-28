import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = 5151;

// Establish database connection (runs asynchronously in serverless environments)
connectDB().catch((error) => {
    console.error('Database connection failed:', error);
});

const server = http.createServer(app);

// Only listen on a port if we are not running on Vercel
if (!process.env.VERCEL) {
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

server.on('error', (error) => {
    console.log(error);
});

export default app;