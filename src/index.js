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
    socket.on('join',(options,callback)=>{
          const{error,user} =addUser({ id:socket.id, ...options })

          if(error){
             return callback(error)
          }

     socket.join(user.room)
     socket.emit('message',generateMessage('admin','Welcome!')
        //  title: 'Welcome!',createdAt: new Date().getTime(),
  )
    socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))
    callback()
    io.to(user.room).emit('roomData',{
        room : user.room,
        users: getUsersInRoom(user.room)
    })
    // socket.broadcast.emit('message',generateMessage("new user has joined! "))
    // sending events from server to cleint
    //socket.emit :that sends event to specific clients
    //io.emit: sends event to every client connected
    //socket.broadcast.emit: sends event to every client connected except the one who is connected
    //io.to.emit : it emits an event to everybody in specific room
    //socket.broadcast.to.emit : it emits an event in spaecific room

    })

    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
         io.to(user.room).emit('message',generateMessage(user.username,message))
        callback() 
    })
    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id) 
        io.to(user.room).emit("locationMessage",
        generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        )
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
       if(user){
        io.to(user.room).emit('message',generateMessage(`${user.username} has left!`)) 
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
       }
       
   
   })
    
    
})
 
server.listen(port,() => {
    console.log(`server is up on port ${port}`)
})