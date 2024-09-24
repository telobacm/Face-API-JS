import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { LIST } from '../../crud'
import { authOptions } from '../../auth/[...nextauth]/route'
import { Prisma } from '@prisma/client'

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
    const select: Prisma.ReportsSelect = { ekspresi: true }
    return LIST(req, { ...P, ...params, select, withoutLimitPagination: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
