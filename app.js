const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Explicit views directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection handling

io.on("connection", (socket) => {
    socket.on("send-location" , (data) => {
        io.emit("Received location", {id: socket.id, ...data});
});
socket.on("disconnect", () => {
        io.emit("user-disconnected",socket.id);
    });
});


// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' }); // Pass data to template
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server startup
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});