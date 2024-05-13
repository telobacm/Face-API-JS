import { Prisma, Users } from '@prisma/client'
import dayjs from 'dayjs'
import { NextResponse } from 'next/server'

export const countEnterPunctuality = (
  user: Users,
  data: Prisma.ReportsUncheckedCreateInput,
  body: any,
) => {
  console.log('Presensi Masuk')

  data.enterExit = 'Masuk'
  if (user?.position === 'DOSEN') {
    data.isPunctual = 'Tepat Waktu'
  }
  if (user?.position === 'STAFF') {
    console.log('Yang jalan staff')
    const shiftEntry = new Date()
    shiftEntry.setHours(7)
    shiftEntry.setMinutes(30)
    shiftEntry.setSeconds(0)
    console.log('parsed body', Date.parse(body.timestamp))
    console.log('parsed shift', Date.parse(JSON.stringify(shiftEntry)))
    console.log(
      'hitung',
      Date.parse(body.timestamp) <= Date.parse(JSON.stringify(shiftEntry)),
    )

    if (body.timestamp <= shiftEntry.toString()) {
      //NOTE: periksa di sini
      console.log('SUKARNO')
      console.log('shiftEntry', shiftEntry.toString())
      console.log('body.timestamp', body.timestamp)
      console.log('shiftEntry', shiftEntry)

      data.isPunctual = 'Tepat Waktu'
    } else {
      data.isPunctual = 'Terlambat'
    }
  }
  if (user?.position === 'SATPAM') {
    console.log('if satpam')
    const shift1Entry = new Date()
    shift1Entry.setHours(6)
    shift1Entry.setMinutes(0)
    shift1Entry.setSeconds(0)
    const shift1Exit = new Date()
    shift1Exit.setHours(10)
    shift1Exit.setMinutes(0)
    shift1Exit.setSeconds(0)

    const shift2Entry = new Date()
    shift2Entry.setHours(14)
    shift2Entry.setMinutes(0)
    shift2Entry.setSeconds(0)
    const shift2Exit = new Date()
    shift2Exit.setHours(18)
    shift2Exit.setMinutes(0)
    shift2Exit.setSeconds(0)

    const shift3Entry = new Date()
    shift3Entry.setHours(22)
    shift3Entry.setMinutes(0)
    shift3Entry.setSeconds(0)
    const shift3Exit = new Date()
    shift3Exit.setHours(2)
    shift3Exit.setMinutes(0)
    shift3Exit.setSeconds(0)
    console.log('body.timestamp', body.timestamp)
    console.log('shift3Entry', shift3Entry.toString())
    if (body.timestamp <= shift1Entry.toString()) {
      console.log('if satpam 1')
      data.isPunctual = 'Tepat Waktu'
      data.shiftSatpam = 'Shift Pagi'
    } else if (
      body.timestamp > shift1Entry.toString() &&
      body.timestamp < shift1Exit.toString()
    ) {
      console.log('if satpam 2')
      data.isPunctual = 'Terlambat'
      data.shiftSatpam = 'Shift Pagi'
    } else if (
      body.timestamp > shift1Exit.toString() &&
      body.timestamp <= shift2Entry.toString()
    ) {
      console.log('if satpam 3')
      data.isPunctual = 'Tepat Waktu'
      data.shiftSatpam = 'Shift Sore'
    } else if (
      body.timestamp > shift2Entry.toString() &&
      body.timestamp < shift2Exit.toString()
    ) {
      console.log('if satpam 4')
      data.isPunctual = 'Terlambat'
      data.shiftSatpam = 'Shift Sore'
    } else if (
      body.timestamp > shift2Exit.toString() &&
      body.timestamp <= shift3Entry.toString()
    ) {
      console.log('if satpam 5')
      data.isPunctual = 'Terlambat'
      data.shiftSatpam = 'Shift Malam'
    } else if (body.timestamp > shift3Entry.toString()) {
      console.log('if satpam 6')
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
  const timeDifference = dayjs(body.timestamp).diff(
    dayjs(lastReport.timestamp),
    'hours',
  )
  console.log('Presensi Pulang')
  console.log('lastReport.timestamp', lastReport.timestamp)
  console.log('body.timestamp', body.timestamp)
  console.log('dayjs lastReport.timestamp', dayjs(lastReport.timestamp))
  console.log('dayjs body.timestamp', dayjs(body.timestamp))
  console.log('timeDifference', timeDifference)

  if (timeDifference < 4) {
    throw new Error(
      'Belum bisa presensi keluar, belum memenuhi minimum jam kerja 4 jam.',
    )
  } else if (timeDifference > 18) {
    //Dianggap tidak presensi keluar sebelumnya, alihkan jadi masuk.
    countEnterPunctuality(user, data, body)
  } else if (timeDifference > 4 && timeDifference < 18) {
    console.log('ini menjalankan POST report Pulang')
    data.enterExit = 'Pulang'
  }
}
