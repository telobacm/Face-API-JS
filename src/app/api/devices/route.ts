import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import {
  HandleError,
  formatIncludeOrSelect,
  parseFilter,
  parseSort,
} from '~/helpers/server'
import { prisma } from '~/../prisma/client'
import { CREATE, LIST } from '~/app/api/crud'

export const POST = CREATE
// export const GET = LIST
export const GET = async (req: NextRequest) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const {
      sort,
      part,
      limit,
      count,
      include = {},
      ...query
    }: any = qs.parse(url)

    const where = await parseFilter(query?.filter)
    const orderBy = parseSort(sort)

    // Include related entities
    const params: any = {
      where,
      orderBy,
      include: {
        kampus: {
          select: {
            name: true,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
        ...include,
      },
    }

    if (part && limit) {
      params.skip = (parseInt(part) - 1) * parseInt(limit)
      params.take = parseInt(limit)
    }

    let result: any = {}

    if (count) {
      const total = await prisma[table].count()
      result = { total }
    } else {
      result = await prisma[table].findMany(params)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return HandleError(error)
  }
}
