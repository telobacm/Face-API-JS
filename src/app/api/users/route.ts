import md5 from 'md5'
import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { CREATE, LIST } from '~/app/api/crud'
import {
  HandleError,
  formatIncludeOrSelect,
  parseFilter,
  parseSort,
} from '~/helpers/server'
import { prisma } from '~/../prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

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

export const GET = async (req: NextRequest, P: any) => {
  try {
    const session: any = await getServerSession(authOptions)
    const user = session?.user

    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const { sort, part, limit, include = {} }: any = qs.parse(url);

    const where = {}

    // Include related entities
    const params: any = {
      where,
      take: parseInt(limit),
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

    // Adjust query based on user role
    if (user?.role === 'ADMIN') {
      params.where = {
        ...params.where,
        kampusId: user?.kampusId,
        unitId: user?.unitId,
      }
    }

    return LIST(req, { ...P, ...params })
  } catch (error: any) {
    return HandleError(error)
  }
}
