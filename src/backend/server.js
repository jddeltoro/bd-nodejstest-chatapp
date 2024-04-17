const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 8000;

// Store room data
const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected');

        // Join room
        socket.on('joinRoom', (username, room) => {
            socket.join(room);           
    
            if (!rooms[room]) {
                rooms[room] = [];
            }
            
            if (!rooms[room].includes(username)) {
                rooms[room].push(username);
                console.log(`${username} joined room ${room}`);
                //emitt current room fot this user name
                socket.emit('room', room);
            }

            //remove the user from other rooms user can only bee in one room at a time
            Object.keys(rooms).forEach(r => {
                if (r !== room) {
                    rooms[r] = rooms[r].filter(user => user !== username);
                    // emit to all users in the room that the user has left
                    io.to(r).emit('message', `${username} has left the room ${r}`);
                    io.to(r).emit('roomUsers', rooms[r]);
                }
            });
    
            // Broadcast to room that user has joined
            socket.to(room).emit('message', `${username} has joined the room`);
    
            // Update user list in the room
            io.to(room).emit('roomUsers', rooms[room]);

            // Update list of rooms
            io.emit('rooms', Object.keys(rooms));
        });
    
        // Send message
        socket.on('sendMessage', (room, message) => {
            console.log(`Message from ${socket.username} to room ${room}: ${message}`);
            io.to(room).emit('message', message);
        });
    
        // Send live location
        socket.on('sendLocation', (room, location) => {
            io.to(room).emit('location', location);
        });

        socket.on('sendImage', (room, image) => {
            io.to(room).emit('image', image);
        });

        socket.on('sendVideo', (room, video) => {
            io.to(room).emit('video', video);
        });
    
        // Disconnect
        socket.on('exit-chat', (username) => {
            console.log(`${username} disconnected`);
    
            // Remove user from every room and update user list
            Object.keys(rooms).forEach(room => {
                rooms[room] = rooms[room].filter(user => user !== username);
                io.to(room).emit('roomUsers', rooms[room]);
            });
        });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});