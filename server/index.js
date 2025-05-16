import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({ origin: clientURL }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: clientURL,
    methods: ["GET", "POST"]
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI; 
if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Chat App Backend Running with Socket.IO');
});

// API routes
app.use('/api/chats', chatRoutes); // Use chat routes
app.use('/api/messages', messageRoutes); // Use message routes

server.listen(port, () => {
    console.log(`Server is running on port: ${port}, awaiting WebSocket connections...`);
}); 