const db = require("../config/db");
const { MahasiswaTable } = require("../models/schema");

// 1. Get All Mahasiswa
exports.getAllMahasiswa = async (req, res) => {
    try {
        const mahasiswaList = await db.select().from(MahasiswaTable);
        res.status(200).json(mahasiswaList);
    } catch (error) {
        console.error("Error fetching mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};

exports.createMahasiswa = async (req, res) => {
    try {
        const { nama, nim, umur, jurusan } = req.body;

        if (!nama || !nim || !umur || !jurusan) {
            return res.status(400).json({ message: "Semua field wajib diisi." });
        }

        const [newMahasiswa] = await db.insert(MahasiswaTable).values({
            nama,
            nim: String(nim),
            umur: Number(umur),
            jurusan,
        }).returning();

        res.status(201).json({ message: "Mahasiswa berhasil dibuat.", mahasiswa: newMahasiswa });
    } catch (error) {
        if (error.code === "23505") { // Unique violation error code for PostgreSQL
            return res.status(400).json({ message: "NIM sudah terdaftar." });
        }
        console.error("Error during creating mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};