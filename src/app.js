const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const anggotaRoutes = require('./routes/anggotaRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Root / Health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: "API Express Auth REST API is running successfully." });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anggota', anggotaRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route tidak ditemukan.",
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;