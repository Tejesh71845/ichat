const users=[];

function userJoin(id,username,room){
    const user={id,username,room};

    users.push(user);

    return user;
}

//Get current user by id
function getCurrentUser(id) {
    return users.find(user=>user.id===id);
}

//user leaves the chat
function leaveChat(id){
    let index=users.findIndex((user)=>user.id==id);
    if (index!==-1){
        return users.splice(index,1)[0];
    }
}

function getRoomUsers(room){
    return users.filter(user=>user.room===room)
}

module.exports={
    userJoin,
    getCurrentUser,
    leaveChat,
    getRoomUsers
}