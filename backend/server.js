const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// dotenv loaded conditionally below
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const predictRoutes = require('./routes/predict');
const chatRoutes = require('./routes/chat');
const newsRoutes = require('./routes/news');
const passwordResetRoutes = require('./routes/passwordReset');
const uploadRoutes = require('./routes/upload');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// ── Security: Crash loudly on startup if critical secrets are missing ──
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('FATAL ERROR: JWT_SECRET environment variable is not defined. Refusing to start.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Rate Limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ── CORS: Restrict to the specific production frontend domain ──
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Express 5 compatibility fix for express-mongo-sanitize (makes req.query writable)
app.use((req, res, next) => {
    if (req.query) {
        Object.defineProperty(req, 'query', {
            value: { ...req.query },
            writable: true,
            configurable: true,
            enumerable: true
        });
    }
    next();
});

app.use(mongoSanitize());
app.use('/api/', limiter);

const authRoutes = require('./routes/auth');

// Routes
app.use('/api/predict', predictRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fakenews';
    console.log("Attempting to connect to:", process.env.MONGO_URI ? "Atlas" : "Localhost");
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
