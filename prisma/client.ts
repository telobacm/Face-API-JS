import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient
}

let conn = null

if (process.env.NODE_ENV === 'production') {
  conn = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  conn = global.prisma
}

export const prisma: any = conn
