const { integer, pgTable, varchar } = require("drizzle-orm/pg-core");

const MahasiswaTable = pgTable("mahasiswa", {
    nim: integer("nim").primaryKey(),
    nama: varchar("nama", { length: 100 }).notNull(),
    jurusan: varchar("jurusan", { length: 100 }).notNull(),
    umur: integer("umur").notNull(),
});

module.exports = {
    MahasiswaTable,
};