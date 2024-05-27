import md5 from 'md5'
import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
// import { CREATE, LIST } from '~/app/api/crud'
import {
  HandleError,
  formatIncludeOrSelect,
  parseFilter,
  parseSort,
} from '~/helpers/server'
import { prisma } from '~/../prisma/client'

export const POST = async (req: NextRequest, { params }: any) => {
  try {
    const data = await req.json()
    const { password, confirm_password, ...payload } = data

    const existingUser = await prisma.users.findFirst({
      where: {
        nip: payload.nip,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          message: 'NIP sudah terdaftar',
        },
        { status: 401 },
      )
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        {
          message: 'New password and confirm new password tidak sama',
        },
        { status: 401 },
      )
    }

    const created: any = await prisma.users.create({
      data: { password: password, ...payload },
    })

    delete created.password

    return NextResponse.json(created)
  } catch (error: any) {
    return HandleError(error)
  }
}

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
        subunit: {
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
