import { PrismaClient, Role } from "@prisma/client";
import { fakerID_ID } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config';

const prisma = new PrismaClient({
    adapter:new PrismaPg({
        connectionString: process.env.DIRECT_DATABASE_URL
    })
});

const courses = [
  "Matematika",
  "Pemrograman API",
  "Bahasa Indonesia",
  "Bahasa Jerman",
  "Pancasila",
];

const STUDENTS_COUNT = 10;
const ENROLLED_PER_STUDENT = Math.min(courses.length, 3);

function factoryUser(id) {
  const name = fakerID_ID.person.fullName();
  return {
    id,
    name,
    email: fakerID_ID.internet.email({
      firstName: name.split(" ")[0],
    }),
    password: fakerID_ID.internet.password({ length: 8 }),
    role: Role.Student,
  };
}

function factoryEnrollment(userId, courseId) {
  return {
    userId,
    courseId,
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  console.log("🗑️  Membersihkan database...");
  
  // Bersihkan data (alternatif TRUNCATE yang lebih aman)
  await prisma.enrollment.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});
  
  console.log("📚 Seeding courses...");
  const coursesResult = await prisma.course.createMany({
    data: courses.map(name => ({ name })),
  });
  console.log(`   ✓ ${coursesResult.count} courses dibuat`);

  console.log("👤 Seeding users...");
  const usersResult = await prisma.user.createMany({
    data: Array.from({ length: STUDENTS_COUNT }, (_, i) =>
      factoryUser(i + 1)
    ),
  });
  console.log(`   ✓ ${usersResult.count} users dibuat`);

  const courseIds = await prisma.course.findMany({
    select: { id: true },
  });

  const enrollments = [];

  for (let userId = 1; userId <= STUDENTS_COUNT; userId++) {
    const pickedCourses = shuffle(courseIds)
      .slice(0, ENROLLED_PER_STUDENT);

    for (const c of pickedCourses) {
      enrollments.push(factoryEnrollment(userId, c.id));
    }
  }

  console.log("📝 Seeding enrollments...");
  const enrollmentsResult = await prisma.enrollment.createMany({
    data: enrollments,
  });
  console.log(`   ✓ ${enrollmentsResult.count} enrollments dibuat`);
  
  // Verifikasi
  const totalUsers = await prisma.user.count();
  const totalCourses = await prisma.course.count();
  const totalEnrollments = await prisma.enrollment.count();
  
  console.log("\n📊 Summary:");
  console.log(`   Users: ${totalUsers}`);
  console.log(`   Courses: ${totalCourses}`);
  console.log(`   Enrollments: ${totalEnrollments}`);
}

main()
  .then(() => console.log("\n✅ Seeding berhasil!"))
  .catch(e => console.error("❌ Seeding gagal:", e))
  .finally(() => prisma.$disconnect());