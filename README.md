# Getting Started

### install semua dependensi
``` bash
    npm install
```
## persiapan prisma orm
 - Daftarkan akun ke neon db -> buat proyek 
 - Daftarkan akun ke [Prisma](https://console.prisma.io) -> buat proyek -> pilih accelerate neon db -> dapatkan string connection

## persiapkan uptstash redis
 - Daftarkan akun ke [upstash](https://console.upstash.com/) -> buat database -> dapatkan string connection & tokenAPI

<br>
<br>

---
``` pwsh
    #for development
    cp .env.example .env

    #for production
    cp .env.example .env.production
```

``` .env

    #db local / neon
    DATABASE_URL="postgresql://p..."

    #accelerate
    ACCELERATE_DATABASE_URL="prisma://accelerate...."

    #default false for development
    FORCE_ACCELERATE=false
```

``` pwsh
    #development
    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma db seed
```

> [!IMPORTANT]
> seed db production dengan ```npm run seed:prod```

### database visual editor
```pwsh
    #development 
    npx prisma studio

    #production
    npm run studio:prod
```



</br>
</br>

# Prisma Schema - User & Course Management

Schema Prisma untuk manajemen **User**, **Course**, dan **Enrollment** menggunakan PostgreSQL.


## Teknologi
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Bahasa:** JavaScript 
- **Prisma Features:** 
  - Binary targets: `native`, `rhel-openssl-3.0.x`
  - Enum untuk role user (`Student`, `Admin`)
  - Junction table untuk relasi many-to-many (`Enrollment`)

---

## Struktur Database

### Tabel `User`
Menyimpan data pengguna.

| Kolom      | Tipe      | Keterangan                        |
|------------|-----------|----------------------------------|
| `id`       | Int       | Primary key, auto increment       |
| `name`     | String    | Nama user                         |
| `email`    | String    | Unique, email user                |
| `password` | String    | Password user                     |
| `role`     | Role      | Default: Student                  |
| `createdAt`| DateTime  | Default: now()                    |
| `enrollments` | Enrollment[] | Relasi ke tabel `Enrollment`  |

### Tabel `Course`
Menyimpan data course.

| Kolom      | Tipe      | Keterangan                        |
|------------|-----------|----------------------------------|
| `id`       | Int       | Primary key, auto increment       |
| `name`     | String    | Unique, nama course               |
| `createdAt`| DateTime  | Default: now()                    |
| `enrollments` | Enrollment[] | Relasi ke tabel `Enrollment`  |

### Tabel `Enrollment` (Junction Table)
Menghubungkan `User` dan `Course`. Menyimpan informasi enrollment dan grade.

| Kolom       | Tipe      | Keterangan                                      |
|------------ |-----------|------------------------------------------------|
| `id`        | Int       | Primary key, auto increment                     |
| `userId`    | Int       | Foreign key ke tabel `User`                     |
| `courseId`  | Int       | Foreign key ke tabel `Course`                   |
| `enrolledAt`| DateTime  | Default: now(), tanggal enroll                 |
| `grade`     | String?   | Optional, nilai mahasiswa                       |

**Relasi dan constraint**
- `user` → relasi ke `User`
- `course` → relasi ke `Course`
- Constraint `@@unique([userId, courseId])` → mencegah user enroll 2x di course yang sama
- `onDelete: Cascade` → jika `User` atau `Course` dihapus, otomatis menghapus enrollment terkait

---

## Enum `Role`
Enum untuk menentukan peran user:

```prisma
enum Role {
  Student
  Admin
}
```

# Endpoint docs
1. [Auth](./app/api/auth/auth_endpoint.md)
2. [User](./app/api/users/users_endpoint.md)
3. [Course](./app/api/courses/courses_endpoint.md)
4. [Enrollment](./app/api/enrollments/enrollments_endpoint.md)
   
# [Laporan](https://docs.google.com/document/d/1R-M3p4_nN2A67jhJJHN5P3LLLCGZBNdC/edit?usp=sharing&ouid=103507177891096345620&rtpof=true&sd=true)
