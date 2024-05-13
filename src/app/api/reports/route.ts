import { NextRequest, NextResponse } from 'next/server'
import { LIST } from '~/app/api/crud'
import { HandleError } from '~/helpers/server'
import { prisma } from '../../../../prisma/client static'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { countEnterPunctuality, countExitAllowance } from '../helpers'

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

    if (!lastReport?.enterExit) {
      data.enterExit = 'Masuk'
      countEnterPunctuality(user, data, body)
    }
    if (lastReport?.enterExit === 'Pulang') {
      if (
        dayjs(lastReport.timestamp).format('YYYY-MM-DD') ===
        dayjs(body.timestamp).format('YYYY-MM-DD')
      ) {
        return NextResponse.json(
          { message: 'Presensi hari ini sudah lengkap.' },
          { status: 500 },
        )
      } else {
        data.enterExit = 'Masuk'
        countEnterPunctuality(user, data, body)
      }
    }
    if (lastReport?.enterExit === 'Masuk') {
      console.log('lastReport?.enterExit === Masuk')
      countExitAllowance(user, data, body, lastReport)
    }
    // data.shiftSatpam = 'Tengah Malam'
    const created = await prisma.reports.create({ data: data })

    return NextResponse.json(created)
  } catch (error: any) {
    console.log(error)
    return HandleError(error)
  }
}
