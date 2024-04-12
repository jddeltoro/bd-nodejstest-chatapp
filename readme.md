# Chat App
This is a simple chat app created using sockets, user can create and join to different rooms and also chat between them

# Server.js

This is the main server file for our application. It uses Express.js for the server, Socket.IO for real-time communication, and CORS for Cross-Origin Resource Sharing.

## Dependencies

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `http`: HTTP server and client.
- `socket.io`: Enables real-time bidirectional event-based communication.
- `cors`: Package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Variables

- `app`: Instance of Express.js.
- `server`: HTTP Server created with Express app.
- `io`: Instance of Socket.IO server.
- `PORT`: Port on which the server runs. It's either the environment variable PORT or 8000.
- `rooms`: An object to store room data.

## Events

- `connection`: Triggered when a new client connects to the server.
- `joinRoom`: Triggered when a user wants to join a room.
- `sendMessage`: Triggered when a user sends a message in a room.
- `sendLocation`: Triggered when a user sends their live location.
- `disconnect`: Triggered when a user disconnects from the server.

## Methods

- `socket.join(room)`: Joins a user to a room.
- `socket.emit(event, data)`: Emits an event to the client along with data.
- `io.to(room).emit(event, data)`: Emits an event to all clients in a room along with data.

## Server

The server listens on the specified PORT and logs a message to the console once it's running.