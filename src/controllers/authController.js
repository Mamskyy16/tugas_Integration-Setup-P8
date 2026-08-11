const db = require("../config/db");
const { UsersTable } = require("../models/schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { eq } = require("drizzle-orm");

// 1. Register User
exports.registerUser = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        if (!nama || !email || !password) {
            return res.status(400).json({ message: "Semua field wajib diisi." });
        }

        // Hash password sebelum menyimpannya ke database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await db.insert(UsersTable).values({
            nama,
            email,
            password: hashedPassword,
        }).returning({ id: UsersTable.id, nama: UsersTable.nama, email: UsersTable.email });

        res.status(201).json({
            message: "User berhasil didaftarkan.",
            user: newUser,
        });
    } catch (error) {
        if (error.code === "23505") { // Unique violation error code for PostgreSQL
            return res.status(400).json({ message: "Email sudah digunakan." });
        }
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};

// 2. Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi."
            });
        }

        const [user] = await db
            .select()
            .from(UsersTable)
            .where(eq(UsersTable.email, email));

        if (!user) {
            return res.status(400).json({
                message: "Email atau password salah."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Email atau password salah."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                nama: user.nama,
                email: user.email,
            },
            process.env.JWT_SECRET || "super_secret_key",
            {
                expiresIn: "1h",
            }
        );

        res.status(200).json({
            message: "Login berhasil.",
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan server."
        });
    }
};