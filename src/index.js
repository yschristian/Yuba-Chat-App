const path = require('path')
const http =  require("http")
const express = require("express")
const socketio = require("socket.io")
const app = express()
const Filter = require("bad-words")
const{ generateMessage, generateLocationMessage } = require("./utils/messages")
const {addUser,removeUser,getUser,getUsersInRoom} = require("./utils/users")


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
     
    // send message to all clients
    socket.on('join',({username, room})=>{

     socket.join(room)
     socket.emit('message',generateMessage('Welcome!')
        //  title: 'Welcome!',createdAt: new Date().getTime(),
  )
    socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined!`))
    // socket.broadcast.emit('message',generateMessage("new user has joined! "))
    // sending events from server to cleint
    //socket.emit :that sends event to specific clients
    //io.emit: sends event to every client connected
    //socket.broadcast.emit: sends event to every client connected except the one who is connected
    //io.to.emit : it emits an event to everybody in specific room
    //socket.broadcast.to.emit : it emits an event in spaecific room

    })

    socket.on('sendMessage', (message,callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        io.emit('message', generateMessage(message))
        callback()
    })
    socket.on('sendLocation',(coords,callback)=>{
      io.emit("locationMessage",
      generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
      )
      callback()
    })

    socket.on('disconnect',()=>{
      io.emit('message',generateMessage('a new user has left'))
   })
    
    
})
 
server.listen(port,() => {
    console.log(`server is up on port ${port}`)
})