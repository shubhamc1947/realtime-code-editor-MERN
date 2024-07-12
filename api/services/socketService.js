
const ACTIONS = require('../actions');
const { getAllConnectedClients } = require('../utils/socketUtils');

let userSocketMap = {};

function handleConnection(socket, io) {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
  
    socket.join(roomId);

    // console.log("L12 socketServicejs Room  is  "+ roomId+" and username "+username )
    const clients = getAllConnectedClients(roomId, userSocketMap,io);
    console.log(JSON.stringify(userSocketMap)+" ---room id ----"+ roomId)

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
        userSocketMap,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({roomId,codingText}) => {
    const text=codingText;
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, text);
  });

  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    console.log("-----------------------------------"+JSON.stringify(code)+" "+userSocketMap[socketId])
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, code);//sahi hai
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
}

module.exports = {
  handleConnection,
};
