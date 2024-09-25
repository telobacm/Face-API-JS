import * as qs from 'qs'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { CREATE, LIST } from '~/app/api/crud'
import { authOptions } from '../auth/[...nextauth]/route'

export const GET = async (req: NextRequest, P: any) => {
    try {
      const session: any = await getServerSession(authOptions)
  
      const table = req.nextUrl.pathname.split('/')[2]
      const url = new URL(req.url).search.substring(1)
      const { sort, part, limit, include = {} }: any = qs.parse(url)
  
      const where = {}
  
      const params: any = { where, include }
  
      if (part && limit) {
        params.skip = (parseInt(part) - 1) * parseInt(limit)
        params.take = parseInt(limit)
      }
  
      return LIST(req, { ...P, ...params, withoutLimitPagination: true })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

export const POST = CREATE
