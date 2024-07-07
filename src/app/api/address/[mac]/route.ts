import { NextRequest, NextResponse } from 'next/server'
import { HandleError } from '~/helpers/server'
import { prisma } from '~/../prisma/client'

export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest, { params, where }: any) => {
  try {
    const deviceInfo = await prisma.devices.findFirst({
      where: {
        mac: params.mac,
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
      },
    })

    return NextResponse.json(deviceInfo)
  } catch (error) {
    return HandleError(error)
  }
}
