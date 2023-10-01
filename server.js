const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./util/messages");
const { userJoin, getCurrentUser,leaveChat,getRoomUsers } = require("./util/users");
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));
const botname = "Admin";
//Run when client connects
io.on("connection", (socket) => {
  //console log when a user connects to the chat room
  // console.log(`${socket.id} connected`);
  // console.log('new connection');

  socket.on("joinRoom", ({ username, room }) => {
    const user=userJoin(socket.id,username,room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botname, "welcome to the chatCord"));

    //broadcasting a message
    socket.broadcast.to(user.room).emit(
      "message",
      formatMessage(botname, `${user.username} joined the chat`)
    );
    
    //send user and room info
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
    })


  });

  
  //listen for chat message
  socket.on("chatMessage", (message) => {
    // console.log(message);
    const user=getCurrentUser(socket.id);
    // const user=userJoin(socket.id,username,room);

    io.to(user.room).emit("message", formatMessage(user.username, message));
  });     


  socket.on("disconnect", () => {
    const user=leaveChat(socket.id)
    io.to(user.room).emit("message", formatMessage(botname, `${user.username} has left the chat`));
  });

});
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});