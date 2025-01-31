import {Server} from 'socket.io';
import http from 'http';
import e from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = e()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

const onlineUsers = {}

io.on('connection', (socket) => {

    const userId = socket.handshake.query.userId
    if(userId){
        onlineUsers[userId]=socket.id
    }
    
    io.emit("getOnlineUsers",Object.keys(onlineUsers))

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
        delete onlineUsers[userId]
        io.emit("getOnlineUsers",Object.keys(onlineUsers))

    })
})
export{io,app, server}