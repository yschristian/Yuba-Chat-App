const users = []

 
const addUser = ({id,username,room})=>{
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return{
            error: 'username and room are required'
        }

    }
   // check for existing user
   const existingUser = users.find((user)=>{
       return user.room === room && user.username === username

   })
   // validate for existing user
   if(existingUser){
        return{
            error: 'username is taken '
        }
   }
   // store user 
   const user = {id,username,room}
   users.push(user)
   return {user}
}
const removeUser = (id) =>{
    // filter could keep running even though they find match
    // users.filter(user =>{
    //     return user.id !== id
    // })
     const index = users.findIndex((user)=> user.id === id)
     if(index !== -1){
         //splice allows to remove user by index
         return users.splice(index,1)[0]
     }
     return{
         error : 'user not found'
     }
}
const getUser = (id)=>{
   const user = users.find(user => user.id === id)
    if(user){
        return {
            message: 'user found',user
        }
    }
    return{
        error: 'user not exist'
    }
}

const getUsersInRoom = (room)=>{
    const usersInRoom = users.filter(user => user.room === room) 
    if(usersInRoom){
        return{
            message:'users found',usersInRoom
        }
    }
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}