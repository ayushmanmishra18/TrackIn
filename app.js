// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Port and Admin Secret from .env

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'defaultsecret';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Track connected users and their location info
const userInfo = {};

// Route to serve main page and inject admin secret
app.get('/', (req, res) => {
  res.render('index', { adminSecret: ADMIN_SECRET });
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user shares their location
  socket.on('locationUpdate', (data) => {
    userInfo[socket.id] = {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      lastUpdated: new Date().toLocaleTimeString()
    };

    // Broadcast updated locations to all clients
    io.emit('locationData', userInfo);
  });

  // On disconnect, remove user
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete userInfo[socket.id];
    io.emit('locationData', userInfo);
  });
});

// Start server
http.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});
