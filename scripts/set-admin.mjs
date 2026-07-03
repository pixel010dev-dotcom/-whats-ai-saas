import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
try {
  const user = await prisma.user.update({
    where: { email: 'diogopfeifer0@gmail.com' },
    data: { role: 'admin' },
  })
  console.log(`User ${user.email} role set to ${user.role}`)
} catch (e) {
  console.error(e)
} finally {
  await prisma.$disconnect()
}
