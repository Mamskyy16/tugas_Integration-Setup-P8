const express = require("express");
const app = express();

const PORT = 8080;

app.use(express.json());

const mahasiswa = [
    {
        nim: "2410512001",
        nama: "Ahmad",
        jurusan: "IT"
    },
    {
        nim: "2410512002",
        nama: "Bagus",
        jurusan: "IT"
    },
    {
        nim: "2410512003",
        nama: "Cantika",
        jurusan: "IT"
    }
];

app.get("/mahasiswa", (req, res) => {res.json(mahasiswa);});

app.get("/mahasiswa/:nim", (req, res) => 
    {
        const nim = req.params.nim;

        const data = mahasiswa.find(mhs => mhs.nim === nim);

        if (!data) {
            return res.status(404).json({
                message: "Mahasiswa tidak ditemukan"
            });
        }
        res.json(data);
    }
);

app.post("/mahasiswa", (req, res) => {
    const { nama, nim } = req.body;

    res.json(
        {
            message: `Berhasil menambahkan mahasiswa baru bernama ${nama}`
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

