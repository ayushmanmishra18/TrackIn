// Import necessary modules
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketio(server); // Initialize Socket.IO for real-time communication

// ----------- Configuration Section -----------

// Set view engine to EJS for templating
app.set('view engine', 'ejs');

// Set views directory explicitly
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' folder (e.g., CSS, client JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// ----------- Real-Time WebSocket Events -----------

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle incoming location data from a user
    socket.on("send-location", (data) => {
        // Broadcast location to all connected clients (admin or user)
        io.emit("Received location", { id: socket.id, ...data });
    });

    // Handle disconnection: inform others that this user left
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// ----------- Routes -----------

// Render the homepage using EJS (views/index.ejs)
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

// ----------- Error Handling -----------

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// ----------- Start Server -----------

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
