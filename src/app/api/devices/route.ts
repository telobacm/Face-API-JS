import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { HandleError, parseFilter, parseSort } from '~/helpers/server'
import { prisma } from '~/../prisma/client'
import { CREATE, LIST } from '~/app/api/crud'

export const POST = CREATE
export const GET = async (req: NextRequest, P: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const {
      sort,
      part,
      limit,

      include = {},
      ...query
    }: any = qs.parse(url)

    const where = {}

    // Include related entities
    const params: any = {
      where,
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

    return LIST(req, { ...P, ...params })
  } catch (error: any) {
    return HandleError(error)
  }
}
