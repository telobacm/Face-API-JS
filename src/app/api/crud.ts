import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/../prisma/client'
// import { unlink } from 'fs/promises'
import path from 'path'
import {
  HandleError,
  formatIncludeOrSelect,
  parseFilter,
  parseSort,
} from '~/helpers/server'

const imagePath = path.resolve('./public/images')
const videoPath = path.resolve('./public/videos')

export const LIST = async (req: NextRequest) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const {
      sort,
      part,
      limit,
      count,
      include = {},
      ...query
    }: any = qs.parse(url)

    const where = await parseFilter(query?.filter)
    const orderBy = parseSort(sort)

    formatIncludeOrSelect(include)
    const params: any = { where, orderBy, include }

    if (part && limit) {
      params.skip = (parseInt(part) - 1) * parseInt(limit)
      params.skip = (parseInt(part) - 1) * parseInt(limit)
      params.take = parseInt(limit)
    }

    let result = {}

    if (count) {
      const total = await prisma[table].count()
      result = { total }
    } else {
      result = await prisma[table].findMany(params)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return HandleError(error)
  }
}

export const DETAIL = async (req: NextRequest, { params, where }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URL(req.url).search.substring(1)
    const { include }: any = qs.parse(url)

    formatIncludeOrSelect(include)
    const queryParams: any = {
      where: where || {
        id: table.includes('users')
          ? params.id.toString()
          : parseInt(params.id),
      },
      include,
    }
    // if (include === 'user') {
    //   queryParams.include = {
    //     author: { select: { fullname: true, role: true, image: true } },
    //   }
    // }

    const detail = await prisma[table].findFirstOrThrow(queryParams)
    return NextResponse.json(detail)
  } catch (error: any) {
    return HandleError(error)
  }
}

export const CREATE = async (req: NextRequest, { params }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const created = await prisma[table].create({ data: await req.json() })

    return NextResponse.json(created)
  } catch (error: any) {
    return HandleError(error)
  }
}

export const UPDATE = async (req: NextRequest, { params }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const { deletedImage, deletedImage2, ...data } = await req.json()
    const updated = await prisma[table].update({
      where: {
        id:
          table.includes('users') || table.includes('devices')
            ? params.id.toString()
            : parseInt(params.id),
      },
      data,
    })
    if (deletedImage) {
      const isVideo = ['.mp4', '.webm', '.gif'].some((ext) =>
        deletedImage.includes(ext),
      )

      const targetPath = isVideo ? videoPath : imagePath

      // await unlink(path.join(targetPath, deletedImage))
    }
    if (deletedImage2) {
      const isVideo = ['.mp4', '.webm', '.gif'].some((ext) =>
        deletedImage2.includes(ext),
      )

      const targetPath = isVideo ? videoPath : imagePath

      // await unlink(path.join(targetPath, deletedImage2))
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    return HandleError(error)
  }
}

// export const REMOVE = async (req: NextRequest, { params }: any) => {
//   try {
//     const table = req.nextUrl.pathname.split('/')[2]
//     const url = new URLSearchParams(req.url)
//     const force = url.get('force')
//     if (force) {
//       await prisma[table].delete({
//         where: {
//           id: table.includes('user')
//             ? params.id.toString()
//             : parseInt(params.id),
//         },
//       })
//     } else {
//       await prisma[table].update({
//         where: {
//           id: table.includes('user')
//             ? params.id.toString()
//             : parseInt(params.id),
//         },
//         data: { active: false },
//       })
//     }
//     return new NextResponse(null, { status: 204 })
//   } catch (error: any) {
//     return HandleError(error)
//   }
// }

export const REMOVE = async (req: NextRequest, { params }: any) => {
  try {
    const table = req.nextUrl.pathname.split('/')[2]
    const url = new URLSearchParams(req.url)
    await prisma[table].delete({
      where: {
        id:
          table.includes('users') || table.includes('devices')
            ? params.id.toString()
            : parseInt(params.id),
      },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    return HandleError(error)
  }
}
