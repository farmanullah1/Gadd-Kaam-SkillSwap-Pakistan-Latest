// gadd_kaam_backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Load env vars
dotenv.config({ path: './config/.env' });

// Connect to Database
connectDB();

// Init Middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(express.json({ extended: false }));

// Mount static directory for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skill-offers', require('./routes/skillOfferRoutes'));
app.use('/api/skill-suggestions', require('./routes/skillSuggestionRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes')); 
app.use('/api/badges', require('./routes/badgeRoutes')); 
app.use('/api/notifications', require('./routes/notificationRoutes')); 
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.get('/api/locations', (req, res) => res.json(require('./utils/locations')));

app.get('/', (req, res) => res.send('API Running'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Setup HTTP Server and Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Attach io to app so it can be used within express routes!
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    // Join a user to their private channel for instant notifications
    socket.on('join_user', (userId) => {
        socket.join(userId.toString());
        console.log(`User ${userId} joined private notification channel.`);
    });

    // Join a user to a specific chat/request room
    socket.on('join_room', (roomId) => {
        socket.join(roomId.toString());
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Leave a specific chat/request room
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId.toString());
        console.log(`Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));