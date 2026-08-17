const errorHandler = (err, req, res, next) => {
    console.error("Global Error Handler caught:", err);

    // Menangani error jika request body JSON tidak valid
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Format JSON pada request body tidak valid.",
        });
    }

    // Menangani PostgreSQL duplicate key / unique constraint error jika dilempar
    if (err.code === "23505") {
        return res.status(400).json({
            success: false,
            message: "Data yang dimasukkan sudah terdaftar (duplikat).",
        });
    }

    // Menangani error JWT jika dilempar ke next(err)
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid.",
        });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token sudah kedaluwarsa.",
        });
    }

    // Menangani custom status code atau default 500
    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Terjadi kesalahan internal pada server."
        : (err.message || "Terjadi kesalahan internal pada server.");

    return res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;
