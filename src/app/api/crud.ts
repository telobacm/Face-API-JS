import * as qs from 'qs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/../prisma/client'
import {
  handleError,
  isObjectEmpty,
  mergeObjects,
  // parseFilter,
  parseInclude,
  sortingDataWithParams,
} from './index'
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

type obj = { [key: string]: any }
type args = {
  params?: any
  select?: obj
  include?: obj
  where?: obj
  withoutLimitPagination?: boolean
  returnValue?: boolean
  QParams?: obj
  body?: obj
}

function completeParams({
  params,
  select,
  include,
}: {
  params: obj
  select: obj
  include: obj
}) {
  if (!isObjectEmpty(include)) {
    params.include = include
  }
  if (!isObjectEmpty(select)) {
    params.select = select
  }
}

// export const LIST = async (
//   req: NextRequest,
//   {
//     include,
//     where = {},
//     select = {},
//     withoutLimitPagination = false,
//     returnValue,
//     QParams,
//   }: args,
// ): Promise<any> => {
//   try {
//     const table = req.nextUrl.pathname.split('/')[2]
//     const url = new URL(req.url).search.substring(1)
//     const {
//       page,
//       take,
//       include: QInclude,
//       ...query
//     }: any = QParams || qs.parse(url)
//     const params: any = {
//       // where: { ...parseFilter(filter), ...where },
//       where: where.AND
//         ? { AND: [where.AND, parseFilter(query.filter)] }
//         : mergeObjects(parseFilter(query.filter), where),
//     }

//     if (!withoutLimitPagination || (page && take)) {
//       params.skip = (parseInt(page || 1) - 1) * parseInt(take || 10)
//       params.take = parseInt(take || 10)
//     }

//     completeParams({
//       params,
//       select,
//       include: include || parseInclude(QInclude),
//     })
//     sortingDataWithParams(query.sort, params)
//     console.log('[PARAMS]:')
//     console.dir(params, { depth: 10 })
//     const [data, count] = await Promise.all([
//       prisma[table].findMany(params),
//       prisma[table].count({ where: params.where }),
//     ])
//     const result = {
//       data,
//       meta: {
//         count,
//         take: take || (withoutLimitPagination ? count : 10),
//         page: page || 1,
//         // pageCount: Math.ceil(
//         //   count / (page || (withoutLimitPagination ? count : 10)),
//         // ),
//         pageCount: Math.ceil(count / (take || 10)),  // Use 'take' here for pageCount calculation
//       },
//     }
//     if (returnValue) {
//       return result
//     }
//     return NextResponse.json(result)
//   } catch (error) {
//     return handleError(error)
//   }
// }

export const LIST = async (
  req: NextRequest,
  {
    include,
    where = {},
    select = {},
    withoutLimitPagination = false,
    returnValue,
    QParams,
  }: args,
): Promise<any> => {
  try {
    const table = req.nextUrl.pathname.split('/')[2];
    const url = new URL(req.url).search.substring(1);
    const {
      page,
      take,
      include: QInclude,
      ...query
    }: any = QParams || qs.parse(url);

    const params: any = {
      where: where.AND
        ? { AND: [where.AND, parseFilter(query.filter)] }
        : mergeObjects(parseFilter(query.filter), where),
    };

    if (!withoutLimitPagination || (page && take)) {
      params.skip = (parseInt(page || 1) - 1) * parseInt(take || 10);
      params.take = parseInt(take || 10);
    }

    completeParams({
      params,
      select,
      include: include || parseInclude(QInclude),
    });

    sortingDataWithParams(query.sort, params);

    console.log('[PARAMS]:');
    console.dir(params, { depth: 10 });  // Log params to ensure 'take' is applied

    const [data, count] = await Promise.all([
      prisma[table].findMany(params),
      prisma[table].count({ where: params.where }),
    ]);

    const result = {
      data,
      meta: {
        count,
        take: take || (withoutLimitPagination ? count : 10),
        page: page || 1,
        pageCount: Math.ceil(count / (take || 10)),
      },
    };

    if (returnValue) {
      return result;
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
};


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
