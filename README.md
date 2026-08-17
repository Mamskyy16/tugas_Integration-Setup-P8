# Express.js REST API - Manajemen Anggota / Mahasiswa

Aplikasi REST API backend berbasis **Node.js**, **Express.js**, **Drizzle ORM**, dan **PostgreSQL** dengan sistem autentikasi **JWT (JSON Web Token)**, **CORS**, dan **Global Error Handling**. Seluruh layanan telah dikonfigurasi untuk berjalan dengan mudah menggunakan **Docker Compose**.

---

## 🛠️ Tech Stack

- **Runtime & Framework**: Node.js, Express.js
- **Database**: PostgreSQL 16
- **ORM & Migrations**: Drizzle ORM, Drizzle Kit
- **Autentikasi**: JSON Web Token (JWT) & bcryptjs
- **Middleware**: CORS, Global Error Handler, JWT Auth Middleware
- **Containerization**: Docker & Docker Compose

---

## 📋 Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Rekomendasi)
- [Node.js](https://nodejs.org/) versi 18+ (Opsional, jika ingin menjalankan secara lokal tanpa Docker)
- [Postman](https://www.postman.com/downloads/) (Untuk pengujian API)

---

## ⚙️ Konfigurasi Environment (`.env`)

Buat berkas `.env` pada direktori root proyek (atau salin dari `.env.example`):

```env
PORT=3000
JWT_SECRET=super_secret_key
DATABASE_URL=postgres://postgres:1234@localhost:5433/db_express
```

> **Catatan**: Jika menggunakan Docker Compose, konfigurasi database container sudah diatur otomatis melalui `docker-compose.yml`.

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Menggunakan Docker Compose (Direkomendasikan)

1. **Jalankan Docker Desktop** di komputer Anda.
2. Buka terminal di direktori proyek ini, lalu jalankan:
   ```bash
   docker compose up -d --build
   ```
3. Docker akan otomatis:
   - Menjalankan database PostgreSQL di port `5433`
   - Melakukan sinkronisasi skema database (`drizzle-kit push`)
   - Menjalankan server Express di `http://localhost:3000`
4. Untuk melihat log server:
   ```bash
   docker compose logs -f
   ```
5. Untuk mematikan aplikasi:
   ```bash
   docker compose down
   ```
6. *(Opsional)* Jika ingin mereset/mengosongkan seluruh data database:
   ```bash
   docker compose down -v
   docker compose up -d
   ```

---

### Opsi 2: Menjalankan Secara Lokal (Tanpa Docker)

1. Pastikan server PostgreSQL lokal Anda aktif.
2. Install seluruh dependensi:
   ```bash
   npm install
   ```
3. Terapkan migrasi skema database:
   ```bash
   npm run db:push
   ```
4. Jalankan server dalam mode development:
   ```bash
   npm run dev
   ```
   *Atau mode produksi:*
   ```bash
   npm start
   ```

---

## 📚 Daftar Endpoint API

Base URL: `http://localhost:3000`

### 1. Health Check
| Method | Endpoint | Auth | Deskripsi |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | ❌ | Mengecek status server |

### 2. Autentikasi (`/api/auth`)
| Method | Endpoint | Auth | Body Request | Deskripsi |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | ❌ | `{ "nama", "email", "password" }` | Registrasi akun baru |
| `POST` | `/api/auth/login` | ❌ | `{ "email", "password" }` | Login & mendapatkan JWT Token |

### 3. CRUD Mahasiswa / Anggota (`/api/anggota`)
| Method | Endpoint | Auth | Body Request / Params | Deskripsi |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/anggota` | ❌ | - | Menampilkan semua mahasiswa |
| `GET` | `/api/anggota/:id` | ❌ | `id` (URL param) | Menampilkan detail mahasiswa |
| `POST` | `/api/anggota` | ✅ | `{ "nama", "nim", "umur", "jurusan" }` | Menambahkan data mahasiswa baru |
| `PUT` | `/api/anggota/:id` | ✅ | `{ "nama", "nim", "umur", "jurusan" }` | Mengubah data mahasiswa |
| `DELETE`| `/api/anggota/:id` | ✅ | `id` (URL param) | Menghapus data mahasiswa |

> 🔒 **Auth (✅)**: Memerlukan Header `Authorization: Bearer <token_jwt>`.

---

## 🧪 Petunjuk Pengujian API di Postman

### Menggunakan Postman Collection yang Tersedia
Proyek ini sudah dilengkapi dengan file koleksi Postman di folder `postman/`.
1. Buka aplikasi **Postman**.
2. Klik tombol **Import** (di pojok kiri atas).
3. Pilih file `postman/Pengujian API Proyek Express.postman_collection.json`.

---

### Langkah Pengujian Manual:

#### Langkah 1: Registrasi Akun (`POST /api/auth/register`)
- **URL**: `http://localhost:3000/api/auth/register`
- **Body** (`raw` > `JSON`):
  ```json
  {
    "nama": "Budi Santoso",
    "email": "budi@example.com",
    "password": "password123"
  }
  ```
- **Response**: Status `201 Created`

#### Langkah 2: Login Akun (`POST /api/auth/login`)
- **URL**: `http://localhost:3000/api/auth/login`
- **Body** (`raw` > `JSON`):
  ```json
  {
    "email": "budi@example.com",
    "password": "password123"
  }
  ```
- **Response**: Status `200 OK` yang berisi string `token`.
- **Salin token** yang didapatkan.

#### Langkah 3: Menambahkan Mahasiswa (`POST /api/anggota`)
- **URL**: `http://localhost:3000/api/anggota`
- **Tab Authorization**: Pilih **Bearer Token**, lalu tempel token dari langkah 2.
- **Body** (`raw` > `JSON`):
  ```json
  {
    "nama": "Siti Rahma",
    "nim": "220101002",
    "umur": 20,
    "jurusan": "Informatika"
  }
  ```
- **Response**: Status `201 Created`.

#### Langkah 4: Mengambil Semua Mahasiswa (`GET /api/anggota`)
- **URL**: `http://localhost:3000/api/anggota`
- **Response**: Status `200 OK` berisi daftar mahasiswa.

#### Langkah 5: Mengubah Data Mahasiswa (`PUT /api/anggota/:id`)
- **URL**: `http://localhost:3000/api/anggota/1`
- **Tab Authorization**: Pilih **Bearer Token**.
- **Body** (`raw` > `JSON`):
  ```json
  {
    "nama": "Siti Rahma S.Kom",
    "nim": "220101002",
    "umur": 21,
    "jurusan": "Sistem Informasi"
  }
  ```
- **Response**: Status `200 OK` data terupdate.

#### Langkah 6: Menghapus Mahasiswa (`DELETE /api/anggota/:id`)
- **URL**: `http://localhost:3000/api/anggota/1`
- **Tab Authorization**: Pilih **Bearer Token**.
- **Response**: Status `200 OK` data terhapus.

---

## 🛡️ Penanganan Error (Global Error Handling)

API telah dilengkapi middleware untuk menyeragamkan respon error:
- **400 Bad Request**: Jika format JSON body rusak atau data duplikat (misal NIM / Email sama).
- **401 Unauthorized**: Jika mengakses endpoint terproteksi tanpa token JWT.
- **403 Forbidden**: Jika token JWT tidak valid atau sudah kedaluwarsa.
- **404 Not Found**: Jika rute URL atau data ID mahasiswa tidak ditemukan.
- **500 Internal Server Error**: Menangani kesalahan server internal secara aman.
