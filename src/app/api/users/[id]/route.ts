import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/../prisma/client'

import { DETAIL, REMOVE, UPDATE } from '~/app/api/crud'
import { HandleError } from '~/helpers/server'

export const PATCH = UPDATE
export const DELETE = REMOVE

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const { include = {} }: any = qs.parse(url)

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
      },
      include: includeOptions,
    }

    const detail = await prisma[table].findFirstOrThrow(queryParams)
    return NextResponse.json(detail)
  } catch (error: any) {
    return HandleError(error)
  }
}
