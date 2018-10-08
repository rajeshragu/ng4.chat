let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

let userList = [];

io.on('connection', (socket) => {

    socket.on('new-user', (userName, callback) => {
        if(userList.indexOf(userName) != -1){
            return(false);
        } else{
            socket.userName = userName;
            userList.push(socket.userName);
            io.sockets.emit('userList',userList);
            return(true);
        }
    });

    socket.on('send-message', (message) => {
        // io.emit('new-message', message);
        io.sockets.emit('new-message', {message:message, userName:socket.userName});
    });

    socket.on('disconnect',function(data){
        if(!socket.userName) return;
        userList.splice(userList.indexOf(socket.userName),1);
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});