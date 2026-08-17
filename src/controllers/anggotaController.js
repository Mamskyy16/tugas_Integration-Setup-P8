const db = require("../config/db");
const { MahasiswaTable } = require("../models/schema");
const { eq } = require("drizzle-orm");

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

// 2. Get Mahasiswa By ID
exports.getMahasiswaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [mahasiswa] = await db
            .select()
            .from(MahasiswaTable)
            .where(eq(MahasiswaTable.id, Number(id)));

        if (!mahasiswa) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
        }

        res.status(200).json(mahasiswa);
    } catch (error) {
        console.error("Error fetching mahasiswa by id:", error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};

// 3. Create Mahasiswa (POST)
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

// 4. Update Mahasiswa (PUT)
exports.updateMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, nim, umur, jurusan } = req.body;

        if (!nama || !nim || !umur || !jurusan) {
            return res.status(400).json({ message: "Semua field wajib diisi." });
        }

        const [updatedMahasiswa] = await db
            .update(MahasiswaTable)
            .set({
                nama,
                nim: String(nim),
                umur: Number(umur),
                jurusan,
            })
            .where(eq(MahasiswaTable.id, Number(id)))
            .returning();

        if (!updatedMahasiswa) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
        }

        res.status(200).json({
            message: "Mahasiswa berhasil diperbarui.",
            mahasiswa: updatedMahasiswa,
        });
    } catch (error) {
        if (error.code === "23505") { // Unique violation error code for PostgreSQL
            return res.status(400).json({ message: "NIM sudah terdaftar." });
        }
        console.error("Error during updating mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};

// 5. Delete Mahasiswa (DELETE)
exports.deleteMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;

        const [deletedMahasiswa] = await db
            .delete(MahasiswaTable)
            .where(eq(MahasiswaTable.id, Number(id)))
            .returning();

        if (!deletedMahasiswa) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
        }

        res.status(200).json({
            message: "Mahasiswa berhasil dihapus.",
            mahasiswa: deletedMahasiswa,
        });
    } catch (error) {
        console.error("Error during deleting mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};