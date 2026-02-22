// gadd_kaam_backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

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

// ✅ CRITICAL FIX: Register Chat Route correctly
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => res.send('API Running'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));