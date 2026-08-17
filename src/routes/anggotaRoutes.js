const express = require('express');
const router = express.Router();
const anggotaController = require('../controllers/anggotaController');
const verifyToken = require('../middlewares/authMiddleware');

// Public route to get all mahasiswa (no authentication required)
router.get('/', anggotaController.getAllMahasiswa);

// Public route to get single mahasiswa by id (no authentication required)
router.get('/:id', anggotaController.getMahasiswaById);

// Protected route to create a new mahasiswa (authentication required)
router.post('/', verifyToken, anggotaController.createMahasiswa);

// Protected route to update an existing mahasiswa (authentication required)
router.put('/:id', verifyToken, anggotaController.updateMahasiswa);

// Protected route to delete a mahasiswa (authentication required)
router.delete('/:id', verifyToken, anggotaController.deleteMahasiswa);

module.exports = router;