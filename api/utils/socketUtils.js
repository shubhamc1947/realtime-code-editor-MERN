
// utils/socketUtils.js

function getAllConnectedClients(roomId, userSocketMap,io) {
  //having all the sockets in room of roomId this
  const roomClients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

  console.log("here"+roomClients)
  const clientData = roomClients.map((socketId) => {
    const isAdmin = roomClients.length === 1; // Check if there's only one client in the room
  
    return {
      socketId,
      username: userSocketMap[socketId], // Assuming userSocketMap maps socketId to username
      admin: isAdmin,
    };
  });
  return clientData;
  }
  
  module.exports = {
    getAllConnectedClients,
  };
  