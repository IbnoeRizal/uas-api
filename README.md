This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### install semua dependensi
``` bash
    npm install
```
### persiapan prisma orm
 - Daftarkan akun ke neon db -> buat proyek 
 - Daftarkan akun ke [Prisma](https://console.prisma.io) -> buat proyek -> pilih accelerate neon db -> dapatkan string connection

``` bash
    cp .env.example .env
```

``` bash
    #db local
    LOCAL_DATABASE_URL="postgresql://p..."

    #accelerate
    DATABASE_URL="prisma://accelerate...."

    #database neon
    DIRECT_DATABASE_URL="postgresql://neondb_...."


```

``` bash
    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma db seed
```

> [!IMPORTANT]
> ganti tujuan seed database di ```seed.js```.

```js
    adapter:new PrismaPg({
        connectionString: process.env.DIRECT_DATABASE_URL
        //jangan pakai koneksi accelerate
    })
```



# Prisma Schema - User & Course Management

Ini adalah schema Prisma untuk manajemen **User**, **Course**, dan **Enrollment** menggunakan PostgreSQL.


## Teknologi
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Bahasa:** JavaScript / TypeScript (Prisma Client JS)
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

---

## run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
