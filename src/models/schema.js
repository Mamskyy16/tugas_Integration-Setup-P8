const { serial, integer, pgTable, varchar } = require("drizzle-orm/pg-core");

const UsersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    nama: varchar("nama", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
});

const MahasiswaTable = pgTable("mahasiswa", {
    id: serial("id").primaryKey(),
    nama: varchar("nama", { length: 255 }).notNull(),
    nim: varchar("nim", { length: 50 }).notNull().unique(),
    umur: integer("umur").notNull(),
    jurusan: varchar("jurusan", { length: 100 }).notNull(),
});

module.exports = {
    MahasiswaTable,
    UsersTable,
};