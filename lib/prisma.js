import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const useAccelerate = process.env.FORCE_ACCELERATE === "true" && !!process.env.ACCELERATE_DATABASE_URL;

const configuration = {
  log: process.env.NODE_ENV === 'development'? ['query','error','warn'] : ['error'],
}

if(useAccelerate)
  configuration.accelerateUrl = process.env.ACCELERATE_DATABASE_URL;
else
  configuration.adapter = new PrismaPg({connectionString:process.env.DATABASE_URL});

/**
 * @type {import("@prisma/client").PrismaClient}
 */
export const prisma = globalThis.prisma ?? (
  useAccelerate? 
    new PrismaClient(configuration).$extends(withAccelerate()):
    new PrismaClient(configuration)
);

if (!globalThis.prisma && process.env.NODE_ENV != 'production')
    globalThis.prisma = prisma;
