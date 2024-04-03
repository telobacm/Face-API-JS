import { NextRequest, NextResponse } from 'next/server'
import { REMOVE, UPDATE } from '~/app/api/crud'
import { prisma } from '~/../prisma/client'
import { HandleError } from '~/helpers/server'

export const PATCH = UPDATE
export const DELETE = REMOVE

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const detail = await prisma.user.findFirstOrThrow({
      where: {
        id: params.id.toString(),
      },
    })

    delete detail.password

    return NextResponse.json(detail)
  } catch (error: any) {
    return HandleError(error)
  }
}
