import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = 5151;

const server = http.createServer(app);

// Establish database connection before starting the server
connectDB()
    .then(() => {
        server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((error) => {
        console.error('Database connection failed. Server not started.', error);
        process.exit(1);
    });

server.on('error', (error) => {
    console.log(error);
});