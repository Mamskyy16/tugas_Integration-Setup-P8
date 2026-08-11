const express = require('express');
const authRoutes = require('./routes/authRoutes');
const anggotaRoutes = require('./routes/anggotaRoutes');

const app = express();

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
    res.status(404).json({ message: "Route tidak ditemukan." });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
});

module.exports = app;