import { NextResponse } from 'next/server'
import * as os from 'os'
import { HandleError } from '~/helpers/server'

export const GET = async () => {
  try {
    const macList: string[] = []
    const networkInterfaces = os.networkInterfaces()
    for (const [key, value] of Object.entries(networkInterfaces)) {
      value?.forEach((val: any) => {
        if (val.mac !== '00:00:00:00:00:00') {
          macList.push(val.mac)
        }
      })
    }

    const deviceInfo = await prisma.devices.findFirst({
      where: {
        mac: {
          in: macList,
        },
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

    const result = {
      macList,
      deviceInfo,
    }

    return NextResponse.json(result)
  } catch (error) {
    return HandleError(error)
  }
}
