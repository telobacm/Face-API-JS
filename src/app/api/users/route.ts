import md5 from 'md5'
import { NextRequest, NextResponse } from 'next/server'
import { CREATE, LIST } from '~/app/api/crud'
import { HandleError } from '~/helpers/server'
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

export const GET = LIST
