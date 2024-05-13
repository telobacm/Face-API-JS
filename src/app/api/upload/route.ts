import path from 'path'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { handleProcessFile } from '~/helpers/server'
import { HandleError } from '~/helpers/server'
import { existsSync } from 'fs'
import { getServerSession } from 'next-auth'
import { prisma } from '../../../../prisma/client static'

// import authOptions from '../auth/[...nextauth]/authOptions'

export async function POST(request: NextRequest) {
  try {
    // const session: any = await getServerSession(authOptions)
    // if (session?.user?.active) {
    const data: any = await request.formData()

    const file: File | null = data.get('file') as unknown as File
    //   const oldImage = data.get('oldImage')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg']

    if (!allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tidak bisa upload selain image!' },
        { status: 400 },
      )
    }

    const { fileName, buffer, pathTo }: any = await handleProcessFile(file, '')

    // if (oldImage) {
    //   const oldImagePath = path.join(pathTo, oldImage)

    //   if (existsSync(oldImagePath)) {
    //     await unlink(path.join(pathTo, oldImage))
    //   }
    // }

    const reportId = data.get('reportId')
    if (file && reportId) {
      await writeFile(path.join(pathTo, fileName), buffer)
      const res = await prisma.reports.update({
        where: { id: parseInt(reportId) },
        data: { image: fileName },
      })
      return NextResponse.json(res)
    }

    throw new Error('reportId atau file tidak valid')

    // } else {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
  } catch (error) {
    return HandleError(error)
  }
}
