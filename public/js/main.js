const socket=io();

const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users')

//Get username and room from URL
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});

// console.log(username,room);
//join to a room

socket.emit('joinRoom',({username,room}));

//get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})
//Message from server
socket.on("message",msg=>{
    console.log(msg);
    outputMessage(msg);
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
//message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message text
    const message=e.target.elements.msg.value;
    //emit the message
    socket.emit('chatMessage',message);
    // outputMessage(message);


    //clear the input
    e.target.elements.msg.value= '';
    e.target.elements.msg.focus();
});

const outputMessage=(msg)=>{
    let div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${msg.userName}<span> ${msg.time} </span></p>
    <p class="text">
      ${msg.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

 
function outputRoomName(room){
    roomName.innerText= room;
}

function outputUsers(users){
    userList.innerHTML = users.map(user => `<li>${user.username}</li>`).join('');
}