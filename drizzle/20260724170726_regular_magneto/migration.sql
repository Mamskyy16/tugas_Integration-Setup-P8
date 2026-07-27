CREATE TABLE "mahasiswa" (
	"nim" integer PRIMARY KEY,
	"nama" varchar(255) NOT NULL,
	"jurusan" varchar(255) NOT NULL UNIQUE
);
