import http from 'http';
import app from './src/app.js';
const PORT = 5151;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

server.on('error', () => {
    console.log(error)
})