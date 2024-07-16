// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const { connectDB } = require('./utils/db');
const socketService = require('./services/socketService');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
// app.use(cors());

app.use(cors({
  // origin: [*], 
  origin: "*",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

app.get("/",(req,resp)=>{
  resp.send("Code Editor Api is working fine");
})


// Socket.io handling
io.on('connection', (socket) => {
  socketService.handleConnection(socket, io);
});

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
