import { NextRequest, NextResponse } from 'next/server'
import { DETAIL, REMOVE, UPDATE } from '~/app/api/crud'

export const PATCH = UPDATE
export const DELETE = REMOVE

export const GET = (req: NextRequest, { params }: any) => {
  return DETAIL(req, { params, where: { id: params.id } })
}
