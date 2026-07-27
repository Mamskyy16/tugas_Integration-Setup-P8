const express = require("express");
const db = require("./db");
const app = express();
const { MahasiswaTable } = require("./db/schema");
const { eq } = require('drizzle-orm');
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Metode GET untuk mengambil semua data mahasiswa
app.get("/mahasiswa", async (req, res) => {

    try {
        const mahasiswa = await db.select().from(MahasiswaTable);
        res.status(200).json({
            success: true,
            message: "Data mahasiswa berhasil diambil",
            data: mahasiswa
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Metode POST untuk menambahkan data mahasiswa baru
app.post("/mahasiswa", async (req, res) => {
    const { nama, nim, jurusan, umur } = req.body;

    try {
        if (!nama || !nim || !jurusan || !umur) {
            return res.status(400).json({
                success: false,
                message: "Nama, NIM, jurusan, dan umur harus diisi"
            });
        }

        if (typeof nama !== "string" || nama.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Nama harus berupa string dan minimal 3 karakter"
            });
        }

        if (typeof nim !== "number") {
            return res.status(400).json({
                success: false,
                message: "NIM harus berupa angka"
            })
        }

        if (typeof umur !== "number" || umur < 15) {
            return res.status(400).json({
                success: false,
                message: "Umur harus berupa angka dan minimal 15 tahun"
            });
        }

        const [mahasiswaBaru] = await db.insert(MahasiswaTable).values({
            nama,
            nim,
            jurusan,
            umur
        }).returning();

        res.status(201).json({
            success: true,
            message: "Data mahasiswa berhasil ditambahkan",
            data: mahasiswaBaru
        })
    
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "NIM sudah digunakan"
            });
        }
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Metode PUT untuk memperbarui data mahasiswa berdasarkan NIM
app.put("/mahasiswa/:nim", async (req, res) => {
    const nimLama = Number(req.params.nim);
    const { nim, nama, jurusan, umur } = req.body;

    try {
        const [mahasiswa] = await db
            .update(MahasiswaTable)
            .set({
                nim,
                nama,
                jurusan,
                umur
            })
            .where(eq(MahasiswaTable.nim, nimLama))
            .returning();

        if (!mahasiswa) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data mahasiswa berhasil diupdate",
            data: mahasiswa
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

//Metode DELETE untuk menghapus data mahasiswa berdasarkan NIM
app.delete("/mahasiswa/:nim", async (req, res) => {
    const { nim } = req.params;

    try {
        const [mahasiswa] = await db
            .delete(MahasiswaTable)
            .where(eq(MahasiswaTable.nim, Number(nim)))
            .returning();

        if (!mahasiswa) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data mahasiswa berhasil dihapus",
            data: mahasiswa
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});