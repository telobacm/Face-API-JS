import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/../prisma/client'
import { HandleError } from '~/helpers/server'

export const PATCH = async (req: NextRequest, { params }: any) => {
  try {
    const data = await req.json()
    const { oldPassword, newPassword, confirmNewPassword } = data

    const user = await prisma.users.findUnique({ where: { id: params.id } })
    if (!user) {
      return NextResponse.json(
        { message: 'User tidak ditemukan' },
        { status: 401 },
      )
    }

    if (user.password !== oldPassword) {
      return NextResponse.json(
        { message: 'Old Password Incorrect' },
        { status: 401 },
      )
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        {
          message: 'New password and confirm new password are not the same',
        },
        { status: 401 },
      )
    }
    const updated = await prisma.users.update({
      where: { id: params.id },
      data: { password: newPassword },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return HandleError(error)
  }
}
