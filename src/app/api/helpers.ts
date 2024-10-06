import { Prisma, Users } from '@prisma/client'
import dayjs from 'dayjs'

export const countEnterPunctuality = (
  user: Users,
  data: Prisma.ReportsUncheckedCreateInput,
  body: any,
) => {
  data.enterExit = 'Masuk'
  if (user?.position === 'DOSEN') {
    data.isPunctual = 'Tepat Waktu'
  }
  if (user?.position === 'STAFF') {
    const shiftEntry = new Date()
    shiftEntry.setHours(7)
    shiftEntry.setMinutes(30)
    shiftEntry.setSeconds(0)

    if (dayjs(body.timestamp) <= dayjs(shiftEntry)) {
      data.isPunctual = 'Tepat Waktu'
    } else {
      data.isPunctual = 'Terlambat'
    }
  }
  if (user?.position === 'SATPAM') {
    const shift1Entry = new Date()
    shift1Entry.setHours(6)
    shift1Entry.setMinutes(0)
    shift1Entry.setSeconds(0)
    const shift1Exit = new Date()
    shift1Exit.setHours(12)
    shift1Exit.setMinutes(0)
    shift1Exit.setSeconds(0)

    const shift2Entry = new Date()
    shift2Entry.setHours(14)
    shift2Entry.setMinutes(0)
    shift2Entry.setSeconds(0)
    const shift2Exit = new Date()
    shift2Exit.setHours(20)
    shift2Exit.setMinutes(0)
    shift2Exit.setSeconds(0)

    const shift3Entry = new Date()
    shift3Entry.setHours(22)
    shift3Entry.setMinutes(0)
    shift3Entry.setSeconds(0)
    const shift3Exit = new Date()
    shift3Exit.setHours(4)
    shift3Exit.setMinutes(0)
    shift3Exit.setSeconds(0)
    if (dayjs(body.timestamp) <= dayjs(shift1Entry)) {
      // console.log('if satpam 1')
      data.isPunctual = 'Tepat Waktu'
      data.shiftSatpam = 'Shift Pagi'
    } else if (
      dayjs(body.timestamp) > dayjs(shift1Entry) &&
      dayjs(body.timestamp) < dayjs(shift1Exit)
    ) {
      // console.log('if satpam 2')
      data.isPunctual = 'Terlambat'
      data.shiftSatpam = 'Shift Pagi'
    } else if (
      dayjs(body.timestamp) > dayjs(shift1Exit) &&
      dayjs(body.timestamp) <= dayjs(shift2Entry)
    ) {
      // console.log('if satpam 3')
      data.isPunctual = 'Tepat Waktu'
      data.shiftSatpam = 'Shift Sore'
    } else if (
      dayjs(body.timestamp) > dayjs(shift2Entry) &&
      dayjs(body.timestamp) < dayjs(shift2Exit)
    ) {
      // console.log('if satpam 4')
      data.isPunctual = 'Terlambat'
      data.shiftSatpam = 'Shift Sore'
    } else if (
      dayjs(body.timestamp) > dayjs(shift2Exit) &&
      dayjs(body.timestamp) <= dayjs(shift3Entry)
    ) {
      // console.log('if satpam 5')
      data.isPunctual = 'Tepat Waktu'
      data.shiftSatpam = 'Shift Malam'
    } else if (dayjs(body.timestamp) > dayjs(shift3Entry)) {
      // console.log('if satpam 6')
      data.isPunctual = 'Terlambat'
      data.shiftSatpam = 'Shift Malam'
    }
  }
}

export const countExitAllowance = (
  user: Users,
  data: Prisma.ReportsUncheckedCreateInput,
  body: any,
  lastReport: any,
) => {
  // console.log('lastReport', lastReport)
  // console.log('body', body)
  // console.log('user', user)

  const currentTimestamp = dayjs(body.timestamp)
  const lastTimestamp = dayjs(lastReport.timestamp)
  const shiftSatpam = lastReport.shiftSatpam
  const timeDifference = currentTimestamp.diff(lastTimestamp, 'hours')

  const isNextDay = !currentTimestamp.isSame(lastTimestamp, 'day')

  // Alur logic presensi pulang jika user adalah SATPAM
  if (user?.position === 'SATPAM') {
    if (timeDifference < 6) {
      throw new Error(
        'Belum bisa presensi keluar, belum memenuhi minimum jam kerja.',
      )
    } else if (timeDifference > 18) {
      //Dianggap tidak presensi keluar sebelumnya, alihkan jadi masuk.
      countEnterPunctuality(user, data, body)
    } else if (timeDifference > 6 && timeDifference < 18) {
      data.enterExit = 'Pulang'
    }
  }
  // Alur logic presensi pulang jika user adalah STAFF
  if (user?.position === 'STAFF') {
    // jika sudah 18 jam dari presensi masuk atau sudah beda hari, maka jadikan presensi masuk baru
    if (timeDifference > 18 || isNextDay) {
      countEnterPunctuality(user, data, body)
    }
    // jika belum 6 jam dari presensi masuk, belum bisa pulang
    else if (timeDifference < 6) {
      throw new Error(
        'Belum bisa presensi keluar, belum memenuhi minimum jam kerja.',
      )
    }
    // jika sudah lebih dari 6 jam, kurang dari 18 jam, dan harinya masih sama, maka presensi pulang
    else if (timeDifference > 6 && timeDifference < 18 && !isNextDay) {
      data.enterExit = 'Pulang'
      data.shiftSatpam = shiftSatpam
    }
  }
  // Alur logic jika user adalah DOSEN
  if (user?.position === 'DOSEN') {
    data.enterExit = 'Pulang'
  }
}
