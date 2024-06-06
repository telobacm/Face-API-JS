import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/../prisma/client'

import { REMOVE, UPDATE } from '~/app/api/crud'
import { HandleError, parseFilter, parseSort } from '~/helpers/server'

export const PATCH = UPDATE
export const DELETE = REMOVE

export const GET = async (req: NextRequest, { params }: any) => {
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

    // Prepare include object
    const includeOptions: any = {
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
      subunit: {
        select: {
          name: true,
        },
      },
    }

    // Check if reports should be included
    if (include.reports === 'true') {
      includeOptions.reports = true
    }

    // Include related entities
    const queryParams: any = {
      where: {
        id: table.includes('users')
          ? params.id.toString()
          : parseInt(params.id),
        ...where,
      },
      include: includeOptions,
      orderBy,
    }

    if (part && limit) {
      queryParams.skip = (parseInt(part) - 1) * parseInt(limit)
      queryParams.take = parseInt(limit)
    }

    let result = {}

    if (count) {
      const total = await prisma[table].count({ where: queryParams.where })
      result = { total }
    } else {
      result = await prisma[table].findFirstOrThrow(queryParams)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return HandleError(error)
  }
}
