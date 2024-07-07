import { NextResponse } from 'next/server'
import * as os from 'os'
import { HandleError } from '~/helpers/server'
import { prisma } from '~/../prisma/client'

export const dynamic = 'force-dynamic'
// INI TIDAK LAGI DIGUNAKAN KARENA TERNYATA os.networkInterfaces() TIDAK BERJALAN DI CLIENT. IA HANYA BERJALAN DI SERVER DAN HANYA AKAN MEMBERIKAN HASIL YANG SESUAI JIKA DIJALANKAN PADA LOCALHOST, TIDAK PADA REMOTE NETWORK. UNTUK SEKARANG GUNAKAN /address/[mac]
export const GET = async () => {
  try {
    const macSet = new Set<string>()
    const networkInterfaces = os.networkInterfaces()
    for (const [key, value] of Object.entries(networkInterfaces)) {
      value?.forEach((val: any) => {
        if (val.mac !== '00:00:00:00:00:00') {
          macSet.add(val.mac)
        }
      })
    }

    const macList = Array.from(macSet)

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
