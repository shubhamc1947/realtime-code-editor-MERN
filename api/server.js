const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./Actions');

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    // console.log("L14 all the same room id socket id "+Array.from(io.sockets.adapter.rooms.get(roomId)))//Q3HO1HY7CrLERgm_AAAZ,koclTwJuxg7BlxVkAAAb something like  this
    //io.sockets.adapter.rooms.get(roomId)=> this gives all the socket id having this roomId
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    // console.log('socket connected', socket.id);
    // console.log("--------------------")
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        
        console.log("Room id and username "+roomId,username+" is here ")
        // console.log("--------------------")
        userSocketMap[socket.id] = username;
        // console.log("L34 usersocketmap "+ JSON.stringify(userSocketMap)); storing in this formate 
        // {"7SdewvfUuZqDdSUZAAAN":"sdfasdf","I3C1H89rBdtdU2XPAAAP":"asdfgh","pisuSlco-V-bOOZWAAAR":"sdfasdf","saC86VW_iK77IVLSAAAT":"adsfss","w0SwcNcuLJ3MVYMVAAAV":"adsfss","15TmBRgV3FRV_ApvAAAX":"adsfss","Q3HO1HY7CrLERgm_AAAZ":"adsfss"}

        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);

        //with for loop we are sending each socket id of that room the new user name in username it's socket id and all the new clients array list so that they can so them in their dashboard
        
        // console.log("L37 all clients in same room "+JSON.stringify(clients))

        //[{"socketId":"Q3HO1HY7CrLERgm_AAAZ","username":"adsfss"},{"socketId":"koclTwJuxg7BlxVkAAAb","username":"vishal"}]

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
                userSocketMap
            });
        });
    });
    socket.on(ACTIONS.CODE_CHANGE,(text)=>{
        // console.log(text);
        socket.broadcast.emit(ACTIONS.CODE_CHANGE,(text));
    })

    socket.on(ACTIONS.SYNC_CODE, ({ code , socketId }) => {
        const currcode=code;
        console.log("L61 code is here"+code)
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, currcode );
    });
    


    //disconnecting process
    socket.on('disconnecting', () => {
        // console.log(userSocketMap[socket.id]+" is gone now")
        const rooms = [...socket.rooms];
        // console.log("L62 All rooms list "+ rooms);
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
