import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaClient: PrismaClient

if (connectionString) {
  // Use PostgreSQL adapter if DATABASE_URL is set
  const adapter = new PrismaPg(connectionString)
  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
    })
} else {
  // Fallback to SQLite for development without DATABASE_URL
  console.warn(
    'DATABASE_URL not set. Using SQLite fallback for development. Set DATABASE_URL to use PostgreSQL.',
  )
  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL ?? 'file:./dev.db',
        },
      },
    })
}

export const prisma = prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma