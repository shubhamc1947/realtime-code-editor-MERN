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
  origin: process.env.FRONTEND_URL, // Update with your frontend URL
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Socket.io handling
io.on('connection', (socket) => {
  // console.log("L34 serverjs hello")
  // console.log("L35 serverjs New Scoket Id is "+socket.id)
  socketService.handleConnection(socket, io);
});

// Connect to MongoDB
connectDB();

// Serve static assets (if needed)
// app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
