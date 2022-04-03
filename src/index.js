const path = require('path')
const http =  require("http")
const express = require("express")
const socketio = require("socket.io")
const app = express()


const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// let count = 0

io.on('connection',(socket) =>{
     console.log("new webSockets connection");

         //socket to send a message to all the connected clients to specific connection
        // socket this emmit in single connection
        // io emit to evry single connection that currently available    
     // when new user come in   
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message',"new user has joined! ") 
    // send message to all clients

    socket.on('sendMessage', (message,callback) => {
        io.emit('message', message)
        callback('Delivered')
    })
    socket.on('sendLocation',(coords)=>{
      io.emit("message",`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

    socket.on('disconnect',()=>{
      io.emit('message','a new user has left')
   })
    
    
})




  












server.listen(port,() => {
    console.log(`server is up on port ${port}`)
})