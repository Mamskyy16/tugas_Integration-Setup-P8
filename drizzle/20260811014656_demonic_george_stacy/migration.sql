CREATE TABLE "mahasiswa" (
	"id" serial PRIMARY KEY,
	"nama" varchar(255) NOT NULL,
	"nim" integer NOT NULL UNIQUE,
	"umur" integer NOT NULL,
	"jurusan" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"nama" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL
);
