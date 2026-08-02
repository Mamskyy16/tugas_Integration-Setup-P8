const express = require('express');
const router = express.Router();
const anggotaController = require('../controllers/anggotaController');
const verifyToken = require('../middlewares/authMiddleware');

// Public route to get all mahasiswa (no authentication required)
router.get('/', verifyToken, anggotaController.getAllMahasiswa);

// Protected route to create a new mahasiswa (authentication required)
router.post('/', verifyToken, anggotaController.createMahasiswa);

module.exports = router;