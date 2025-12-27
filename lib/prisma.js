import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import 'dotenv/config'

/**
 * @type {import("@prisma/client").PrismaClient}
 */
export const prisma = globalThis.prisma ?? new PrismaClient({
  log : process.env.NODE_ENV === 'development'? ['query','error','warn'] : ['error'],
  accelerateUrl: process.env.DATABASE_URL,
  // adapter: new PrismaPg({connectionString:process.env.DATABASE_URL})
}).$extends(withAccelerate());

if (!globalThis.prisma && process.env.NODE_ENV != 'production')
    globalThis.prisma = prisma;
