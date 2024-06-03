import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { LIST } from '~/app/api/crud'
// import { prisma } from '~/../prisma/client static'
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

export const GET = LIST

const groupReportsByDate = (reports: any[]) => {
  return reports.reduce((acc: any, report: any) => {
    const date = dayjs(report.timestamp).format('YYYY-MM-DD')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(report)
    return acc
  }, {})
}

// export const GET = async (req: NextRequest) => {
//   try {
//     const table = req.nextUrl.pathname.split('/')[2]
//     const url = new URL(req.url).search.substring(1)
//     const {
//       sort,
//       part,
//       limit,
//       count,
//       include = {},
//       ...query
//     }: any = qs.parse(url)

//     const where = await parseFilter(query?.filter)
//     const orderBy = parseSort(sort)

//     formatIncludeOrSelect(include)
//     const params: any = { where, orderBy, include }

//     if (part && limit) {
//       params.skip = (parseInt(part) - 1) * parseInt(limit)
//       params.skip = (parseInt(part) - 1) * parseInt(limit)
//       params.take = parseInt(limit)
//     }

//     let result = {}

//     if (count) {
//       const total = await prisma[table].count()
//       result = { total }
//     } else {
//       result = await prisma[table].findMany({
//         orderBy: { timestamp: 'desc' },
//       })
//       // groupReportsByDate(result)
//     }

//     return NextResponse.json(result)
//   } catch (error: any) {
//     return HandleError(error)
//   }
// }

// export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { userId } = req.query

//   if (!userId || typeof userId !== 'string') {
//     return res.status(400).json({ error: 'Invalid or missing userId' })
//   }

//   try {
//     const reports = await prisma.reports.findMany({
//       where: { userId },
//       orderBy: { timestamp: 'asc', userId: 'asc' },
//     })

//     const groupedReports = groupReportsByDate(reports)
//     console.log(groupedReports)

//     return res.status(200).json(groupedReports)
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: 'Internal server error' })
//   }
// }

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
      console.log('!lastReport?.enterExit')
      data.enterExit = 'Masuk'
      countEnterPunctuality(user, data, body)
    } else if (lastReport?.enterExit === 'Pulang') {
      console.log('lastReport?.enterExit === Pulang')
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
    } else if (lastReport?.enterExit === 'Masuk') {
      console.log('lastReport?.enterExit === Masuk')
      countExitAllowance(user, data, body, lastReport)
    }
    const created = await prisma.reports.create({ data: data })

    return NextResponse.json(created)
  } catch (error: any) {
    return HandleError(error)
  }
}
