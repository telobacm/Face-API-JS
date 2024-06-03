import { NextRequest, NextResponse } from 'next/server'
import { LIST } from '~/app/api/crud'
// import { prisma } from '~/../prisma/client static'
import { Prisma } from '@prisma/client'
import { prisma } from '~/../prisma/client'
import dayjs from 'dayjs'
import { countEnterPunctuality, countExitAllowance } from '../helpers'
import { HandleError } from '~/helpers/server'

export const GET = LIST

export const POST = async (req: NextRequest, { params }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const body = await req.json()

    const user = await prisma.users.findFirstOrThrow({
      where: { id: body.userId },
    })

    const data: Prisma.ReportsUncheckedCreateInput = body ? { ...body } : {}
    const lastReport = await prisma.reports.findFirst({
      orderBy: { timestamp: 'desc' },
      where: { userId: body?.userId || '' },
    })
    console.log('lastReport', lastReport)

    if (!lastReport?.enterExit) {
      console.log('Tidak ditemukan report User ini sebelumnya')
      data.enterExit = 'Masuk'
      await countEnterPunctuality(user, data, body)
    }

    if (lastReport?.enterExit === 'Pulang') {
      console.log('Report terakhir adalah Pulang')
      if (
        dayjs(lastReport.timestamp).format('YYYY-MM-DD') ===
        dayjs(body.timestamp).format('YYYY-MM-DD')
      ) {
        console.log('Hari ini sudah presensi masuk dan pulang')
        return NextResponse.json(
          { message: 'Presensi hari ini sudah lengkap.' },
          { status: 500 },
        )
      } else {
        console.log('Sekarang bikin presensi Masuk')
        data.enterExit = 'Masuk'
        await countEnterPunctuality(user, data, body)
      }
    }

    if (lastReport?.enterExit === 'Masuk') {
      console.log('Report terakhir adalah Masuk')
      await countExitAllowance(user, data, body, lastReport)
    }

    const created = await prisma.reports.create({ data: data })
    console.log(data)

    return NextResponse.json(created)
  } catch (error: any) {
    return HandleError(error)
  }
}
