import { POSITIONS, Prisma, PrismaClient, USER_ROLES } from '@prisma/client'

const prisma = new PrismaClient()

const kampusSeed: Prisma.KampusUncheckedCreateInput[] = [
  { name: 'Karangmalang' },
  { name: 'Jl Kenari' },
  { name: 'Jl Bantul' },
  { name: 'Wates' },
  { name: 'Gunung Kidul' },
]

const unitSeed: Prisma.UnitUncheckedCreateInput[] = [
  { name: 'Direktorat Akademik, Kemahasiswaan, dan Alumni' },
  { name: 'Direktorat Kerja Sama, Sistem Informasi, Inovasi, dan Usaha' },
  { name: 'Direktorat Pendidikan Profesi dan Kompetensi' },
  { name: 'Direktorat Penjaminan Mutu' },
  { name: 'Direktorat Perencanaan dan Keuangan' },
  { name: 'Direktorat Riset dan Pengabdian Kepada Masyarakat' },
  { name: 'Direktorat Umum, Sumber Daya, dan Hukum' },
  { name: 'Fakultas Bahasa, Seni, dan Budaya' },
  { name: 'Fakultas Ekonomi dan Bisnis' },
  { name: 'Fakultas Ilmu Keolahragaan dan Kesehatan' },
  { name: 'Fakultas Ilmu Pendidikan dan Psikologi' },
  { name: 'Fakultas Ilmu Sosial, Hukum, dan Ilmu Politik' },
  { name: 'Fakultas Matematika dan Ilmu Pengetahuan Alam' },
  { name: 'Fakultas Teknik' },
  { name: 'Fakultas Vokasi' },
  { name: 'Sekolah Pascasarjana' },
]

const subunitSeed: Prisma.SubunitUncheckedCreateInput[] = [
  { position: 'STAFF', name: 'Akademik, Kemahasiswaan dan Alumni' },
  { position: 'STAFF', name: 'Umum Kepegawaian dan Barang Milik Negara' },
  { position: 'STAFF', name: 'Keuangan dan Akuntansi' },
  { position: 'DOSEN', name: 'Departemen Administrasi Pendidikan' },
  { position: 'DOSEN', name: 'Departemen Adminitrasi Publik' },
  { position: 'DOSEN', name: 'Departemen Adminstrasi Pendidikan' },
  { position: 'DOSEN', name: 'Departemen Ilmu Keolahragaan' },
  { position: 'DOSEN', name: 'Departemen Ilmu Komunikasi' },
  { position: 'DOSEN', name: 'Departemen Kurikulum dan Teknologi Pendidikan' },
  { position: 'DOSEN', name: 'Departemen Manajemen' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Administrasi Perkantoran' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Akuntansi' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Anak Usia Dini' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Bahasa Daerah' },
  {
    position: 'DOSEN',
    name: 'Departemen Pendidikan Bahasa dan Sastra Indonesia',
  },
  { position: 'DOSEN', name: 'Departemen Pendidikan Bahasa Inggris' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Bahasa Jerman' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Bahasa Perancis' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Biologi' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Ekonomi' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Fisika' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Geografi' },
  { position: 'DOSEN', name: 'Departemen Pendidikan IPA' },
  { position: 'DOSEN', name: 'Departemen Pendidikan IPS' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Jasmani Sekolah Dasar' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Kepelatihan Olahraga' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Kewarganegraan dan Hukum' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Kimia' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Luar Biasa' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Luar Sekolah' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Matematika' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Olahraga' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Sejarah' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Sekolah Dasar' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Seni Musik' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Seni Rupa' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Seni Tari' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Sosiologi' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Teknik Boga dan Busana' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Teknik Elektro' },
  {
    position: 'DOSEN',
    name: 'Departemen Pendidikan Teknik Elektronika dan Informatika',
  },
  { position: 'DOSEN', name: 'Departemen Pendidikan Teknik Mesin' },
  { position: 'DOSEN', name: 'Departemen Pendidikan Teknik Otomotif' },
  {
    position: 'DOSEN',
    name: 'Departemen Pendidikan Teknik Sipil dan Perencanaan',
  },
  { position: 'DOSEN', name: 'Departemen Psikologi' },
  { position: 'DOSEN', name: 'Departemen Psikologi Pendidikan dan Bimbingan' },
]

const superAdmin = {
  name: 'Super Admin',
  email: 'superadmin@mail.net',
  password: 'qwerty',
  nip: 'A1',
  role: USER_ROLES.SUPERADMIN,
  position: POSITIONS.STAFF,
  kampusId: 1,
  unitId: 1,
  gender: 'Pria',
  whitelist: false,
  descriptors: [{}],
}

async function main() {
  // clear
  console.log('clearing existed data if there any...')
  await prisma.reports.deleteMany({})
  await prisma.users.deleteMany({})
  await prisma.devices.deleteMany({})
  await prisma.kampus.deleteMany({})
  await prisma.unit.deleteMany({})
  await prisma.subunit.deleteMany({})

  // seed
  console.log('start seeding...')
  await prisma.$transaction(async (prisma) => {
    for (const kampusData of kampusSeed) {
      await prisma.kampus.create({ data: kampusData })
    }
    for (const unitData of unitSeed) {
      await prisma.unit.create({ data: unitData })
    }
    for (const subunitData of subunitSeed) {
      await prisma.subunit.create({ data: subunitData })
    }
    const newKampus = await prisma.kampus.findFirst({})
    const newUnit = await prisma.unit.findFirst({})

    if (!!newKampus && !!newUnit) {
      await prisma.users.create({
        data: {
          name: 'Super Admin',
          email: 'superadmin@mail.net',
          password: 'qwerty',
          nip: 'A1',
          role: USER_ROLES.SUPERADMIN,
          position: POSITIONS.STAFF,
          kampusId: newKampus.id,
          unitId: newUnit.id,
          gender: 'Pria',
          whitelist: false,
          descriptors: [{}],
          isDeleted: false,
        },
      })
    }
  })

  console.log('Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
