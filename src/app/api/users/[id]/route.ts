import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/../prisma/client'

import { DETAIL, REMOVE, UPDATE } from '~/app/api/crud'
import { HandleError } from '~/helpers/server'

export const PATCH = UPDATE
export const DELETE = REMOVE

// export const GET = (req: NextRequest, { params }: any) => {
//   return DETAIL(req, { params, where: { id: params.id }, })
// }

export const GET = async (req: NextRequest, { params, where }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const { include = {} }: any = qs.parse(url)

    // Include related entities
    const queryParams: any = {
      where: where || {
        id: table.includes('users')
          ? params.id.toString()
          : parseInt(params.id),
      },
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
        subunit: {
          select: {
            name: true,
          },
        },
        ...include,
      },
    }

    const detail = await prisma[table].findFirstOrThrow(queryParams)
    return NextResponse.json(detail)
  } catch (error: any) {
    return HandleError(error)
  }
}
