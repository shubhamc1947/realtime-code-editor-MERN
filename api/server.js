const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./utils/db');
const socketService = require('./services/socketService');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const { requestLogger } = require('./middleware/loggingMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const statusRoutes = require('./routes/statusRoutes');
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use('/api/status', statusRoutes);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

// Routes
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Code Editor API is working fine");
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
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