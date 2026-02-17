import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';      
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken'; // + Added
import { prisma } from './config/db.js'; // + Added

import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js'; // + Added from Step 2
import { errorMiddleware } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "my-super-secret-key-in-production";

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware for Socket Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    socket.data.user = decoded; // Attach user data to socket
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', limiter);

app.get('/', (_req, res) => res.send('BubingaChat API'));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes); // + Added
app.use(errorMiddleware);

io.on('connection', (socket) => {
  const userId = socket.data.user.userId;
  console.log(`User connected: ${userId} (${socket.id})`);

  // Join a specific room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room: ${roomId}`);
  });

  // Leave a room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${userId} left room: ${roomId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { roomId, content } = data;

      // 1. Save to Database
      const message = await prisma.message.create({
        data: {
          content,
          room_id: roomId,
          user_id: userId,
        },
        include: {
          user: {
            select: { id: true, username: true } // Return sender info
          }
        }
      });

      // 2. Broadcast to ONLY that room
      io.to(roomId).emit('receive_message', message);
      
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit('error', { message: "Failed to send message" });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

// Use httpServer.listen instead of app.listen to make sockets work
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));