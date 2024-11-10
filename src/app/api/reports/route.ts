import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '~/../prisma/client'
import dayjs from 'dayjs'
import { countEnterPunctuality, countExitAllowance } from '../helpers'
import {
  HandleError,
  formatIncludeOrSelect,
  parseFilter,
  parseSort,
} from '~/helpers/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { LIST } from '../crud'

export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest, P: any) => {
  try {
    const session: any = await getServerSession(authOptions)
    const user = session?.user

    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const { sort, part, limit, include = {} }: any = qs.parse(url)

    const where = {}

    const params: any = { where, include }

    if (part && limit) {
      params.skip = (parseInt(part) - 1) * parseInt(limit)
      params.take = parseInt(limit)
    }

    // Adjust query based on user role
    if (user?.role === 'ADMIN') {
      params.where = {
        ...params.where,
        user: {
          kampusId: user?.kampusId,
          unitId: user?.unitId,
        },
      }
    }
// Include kampus and unit in the query
params.include = {
  user: {
    include: {
      kampus: true, // Ensure kampus relation is included
      unit: true,   // Ensure unit relation is included
      subunit: true,
    },
  },
};

    return LIST(req, { ...P, ...params })
  } catch (error: any) {
    // return NextResponse.json({ error: error.message }, { status: 500 })
    return HandleError(error)
  }
}

export const POST = async (req: NextRequest, { params }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const body = await req.json()

    const user = await prisma.users.findFirstOrThrow({
      where: { id: body.userId },
    })

    const data: Prisma.ReportsUncheckedCreateInput = body ? { ...body } : {}

    // ChatGPT suggestion Prepare the data for the new report
    // const data: Prisma.ReportsUncheckedCreateInput = {
    //   ...body,
    // user: { connect: { id: body.userId } }, // Connect the user
    // kampus: { connect: { id: body.kampusId } },
    // unit: { connect: { id: body.unitId } },
    // }

    const lastReport = await prisma.reports.findFirst({
      orderBy: { timestamp: 'desc' },
      where: { userId: body?.userId || '' },
    })

    if (!lastReport?.enterExit) {
      data.enterExit = 'Masuk'
      await countEnterPunctuality(user, data, body)
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
        await countEnterPunctuality(user, data, body)
      }
    }

    if (lastReport?.enterExit === 'Masuk') {
      await countExitAllowance(user, data, body, lastReport)
    }

    const created = await prisma.reports.create({ data: data })

    return NextResponse.json(created)
  } catch (error: any) {
    return HandleError(error)
  }
}
