const socket = io('http://localhost:8000');

let username;
let room;

const roomForm = document.getElementById('room-form');
const chatRoom = document.getElementById('chat-room');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');
const messagesList = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');
const locationButton = document.getElementById('location-btn');
const joinButton = document.getElementById('join-btn');
const channelsContainer = document.getElementById('channels-container');
const channels = document.getElementById('channels');

// Join room
joinButton.addEventListener('click', (e) => {
    username = document.getElementById('username').value;
    room = document.getElementById('room').value;

    socket.emit('joinRoom', username, room);

    roomForm.style.display = 'none';
    chatRoom.style.display = 'block';
    channelsContainer.style.display = 'block';
});

// Send message
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('sendMessage', room, message);
        messageInput.value = '';
    }
});

// Send live location
locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        socket.emit('sendLocation', room, location);
    }, () => {
        alert('Unable to fetch location');
    });
});

// Listen for messages
socket.on('message', message => {
    const p = document.createElement('p');
    p.textContent = message;
    messagesList.appendChild(p);
});

// Listen for live locations
socket.on('location', location => {
    const p = document.createElement('p');
    p.innerHTML = `<a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" target="_blank">My current location</a>`;
    messagesList.appendChild(p);
});

// Listen for room user updates
socket.on('roomUsers', users => {
    usersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
});

// Listen for room updates
socket.on('rooms', rooms => {
    channels.innerHTML = '';
    rooms.forEach(room => {
        const button = document.createElement('button');
        button.textContent = room;
        button.addEventListener('click', () => {
            socket.emit('joinRoom', username, room);
        });
        channels.appendChild(button);
    });
});

socket.on('room', room => {
    roomName.textContent = room;
});