const { Server } = require('socket.io')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5153',
        methods: ['GET', 'POST']
    }
});

const userSocketMap = {}; // store socketId with the userInformation

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        // console.log(`User connected UserId: ${userId}, Socket: ${socket.id}`)
    }

    io.emit('getOnlineUser', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User Disconnect UserId: ${userId}, Socket: ${socket.id}`)
        }
        io.emit('getOnlineUser', Object.keys(userSocketMap))
    })

})

const getRecieverSocketId = (receiverId) => {
    return userSocketMap[receiverId] 
    // return the socket id of the user jise hame msj bhejna h...
}

module.exports = {
    app, server, io, getRecieverSocketId
}
