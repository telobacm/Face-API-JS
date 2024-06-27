import path from 'path'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { handleProcessFile } from '~/helpers/server'
import { HandleError } from '~/helpers/server'
import { prisma } from '~/../prisma/client'

export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
  try {
    const data: any = await request.formData()

    const file: File | null = data.get('file') as unknown as File
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

    const reportId = data.get('reportId')
    if (!reportId) {
      throw new Error('reportId tidak valid')
    }

    // Handle the file processing
    const { fileName, buffer } = await handleProcessFile(file, '')

    if (!fileName || !buffer) {
      throw new Error('File processing failed')
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
    await writeFile(filePath, buffer)

    const res = await prisma.reports.update({
      where: { id: parseInt(reportId) },
      data: { image: `${fileName}` },
    })

    return NextResponse.json(res)
  } catch (error) {
    return HandleError(error)
  }
}
