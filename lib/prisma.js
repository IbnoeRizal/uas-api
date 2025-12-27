import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";

/**
 * @type {import("@prisma/client").PrismaClient}
 */
export const prisma = globalThis.prisma ?? new PrismaClient({
  log : process.env.NODE_ENV === 'development'? ['query','error','warn'] : ['error']
}).$extends(withAccelerate());

if (!globalThis.prisma)
    globalThis.prisma = prisma;
