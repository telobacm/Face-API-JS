import { prisma } from '../client'

async function main() {
  console.log('start seeding...')
  // clear
  await prisma.report.deleteMany({})
  await prisma.descriptor.deleteMany({})
  await prisma.user.deleteMany({})

  // seed new

  const superadmin = {
    email: 'superadmin@mailinator.com',
    // password: 'c93ccd78b2076528346216b3b2f701e6', //admin1234
    password: 'admin123',
    name: 'Super Admin',
  }
  const user = await prisma.user.upsert({
    where: { email: superadmin?.email },
    update: { password: superadmin?.password },
    create: { ...superadmin, role: 'SUPERADMIN' },
  })

  // const users = await prisma.users.createMany({
  //   data: usersData,
  //   skipDuplicates: true,
  // })
  // const descriptor = await prisma.descriptor.createMany({
  //   data: descriptorData,
  //   skipDuplicates: true,
  // })
  // const report = await prisma.report.createMany({
  //   data: reportData,
  //   skipDuplicates: true,
  // })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
