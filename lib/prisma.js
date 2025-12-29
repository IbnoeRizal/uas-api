import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

/**
 * @type {import("@prisma/client").PrismaClient}
 */
export const prisma = globalThis.prisma ?? new PrismaClient({
  log : process.env.NODE_ENV === 'development'? ['query','error','warn'] : ['error'],
  accelerateUrl: process.env.ACCELERATE_DATABASE_URL,
}).$extends(withAccelerate());

if (!globalThis.prisma && process.env.NODE_ENV != 'production')
    globalThis.prisma = prisma;
