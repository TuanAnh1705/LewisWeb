// File: lib/prisma.ts (Bên dự án DASHBOARD)
// (Nếu output của bạn ở `src/generated/prisma` thì dùng import dưới)
import { PrismaClient } from '../generated/prisma'
// Nếu không, bạn có thể dùng:
// import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma