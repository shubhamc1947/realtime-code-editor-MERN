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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// Routes
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Code Editor API is working fine");
});

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io handling
io.on('connection', (socket) => {
  socketService.handleConnection(socket, io);
});

// Connect to the database
connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
