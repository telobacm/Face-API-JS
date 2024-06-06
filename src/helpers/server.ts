import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { prisma } from '~/../prisma/client'
import { unlink } from 'fs/promises'
import { getFileName } from './utils'

interface SearchFilter {
  search: string
  search_keys: string
}

interface ContainsFilter {
  contains: string
  mode: 'insensitive'
}

interface KeyObject {
  [key: string]: KeyObject | ContainsFilter
}

interface QueryFilterResult {
  OR?: KeyObject[]
}

const isDev = process.env.NODE_ENV == 'development'
export const headers = { 'Content-Type': 'application/json' }

export const formatIncludeOrSelect = (
  queryInclude: any,
  excludeTables: string[] = [],
) => {
  // const userSelect = {
  //   select: {
  //     id: true,
  //     email: true,
  //     name: true,
  //     acc_no: true,
  //     acc_branch_id: true,
  //     phone: true,
  //     address: true,
  //     image: true,
  //     role: true,
  //     active: true,
  //   },
  // };
  // console.log('__jalan');

  const userSelect = true

  for (const key in queryInclude) {
    if (excludeTables.includes(key)) {
      NextResponse.json({ message: `Access to ${key} Denied` }, { status: 500 })
      // throw new ForbiddenException(`Access to ${key} Denied`);
    }

    if (typeof queryInclude[key] === 'string') {
      if (queryInclude[key] === 'true') {
        if (key.includes('user')) {
          queryInclude[key] = userSelect
        } else {
          queryInclude[key] = true
        }
      } else {
        // example:
        // include=id,name,address
        // select=id,name,address
        queryInclude[key] = parseIncludeOrSelect(queryInclude[key])
      }
    }

    if (typeof queryInclude[key] === 'object') {
      formatIncludeOrSelect(queryInclude[key])
    }
  }
}

export const parseIncludeOrSelect = (selectValue: string) => {
  const fields = selectValue.split(',')

  const newValue: any = {}

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    newValue[field] = true
  }
  return newValue
}

export const HandleError = (error: any) => {
  const message = error.stack.split('\n', 2).join('\n')
  console.error(`[ERROR]`, message)
  const object: any = {
    code: error.code,
    name: error.name,
    message: error.message,
  }
  if (isDev) object.stack = error.stack
  if (error.code === 'P2025' || error.name === 'NotFoundError') {
    return NextResponse.json(object, { status: 404 })
  } else {
    return NextResponse.json(object, { status: 500 })
  }
}
const validate = (value: any) => {
  if (!isNaN(value)) value = parseInt(value)
  if (value == 'true') value = true
  if (value == 'false') value = false
  return value
}

const handleQuerySearch = (queryFilter: SearchFilter): QueryFilterResult => {
  const { search, search_keys } = queryFilter
  if (search && search_keys) {
    const keys = search_keys.split(',')
    const createObject = (keysArray: string[]): KeyObject => {
      const key = keysArray[0]
      const remainingKeys = keysArray.slice(1)
      if (remainingKeys.length === 0) {
        return { [key]: { contains: search, mode: 'insensitive' } }
      }
      return { [key]: createObject(remainingKeys) }
    }
    const transformedKeys = keys.map((key) => {
      const keyArray = key.split('.')
      return createObject(keyArray)
    })
    return { OR: transformedKeys }
  }
  return {}
}

export const parseFilter = (queryFilter: any) => {
  const where: any = {}
  let searchQuery = {}

  if (queryFilter) {
    if (queryFilter.search && queryFilter.search_keys) {
      searchQuery = handleQuerySearch(queryFilter)
    }
    delete queryFilter.search
    delete queryFilter.search_keys

    for (const k in queryFilter) {
      const value = queryFilter[k]
      if (typeof value === 'object') {
        const operators = [
          'in',
          'not',
          'between',
          'gt',
          'lt',
          'gte',
          'lte',
          'like',
        ]
        const [k2] = Object.keys(value)
        if (!operators.includes(k2)) {
          where[k] = { [k2]: validate(value[k2]) }
        }
        if (value.between) {
          const [val1, val2] = value.between?.split(',')
          where[k] = { gte: val1, lte: val2 }
        }
        if (value.in) {
          const arr = value.in?.split(',').map((x: any) => validate(x))
          where[k] = { in: arr }
          // let arr = [];
          // if (value.in.eq) {
          //   arr = value.in?.eq.split(',').map((x: any) => ({
          //     [k]: { equals: validate(x) },
          //   }));
          // } else {
          //   arr = value.in?.split(',').map((x: any) => ({
          //     // [k]: { contains: validate(x), mode: 'insensitive' },
          //     [k]: validate(x),
          //   }));
          // }
          // where.OR = arr;
        }
        if (value.not) {
          const arr = value.not?.split(',').map((x: any) => validate(x))
          if (where.NOT) {
            where.NOT = { ...where.NOT, [k]: { in: arr } }
          } else {
            where.NOT = { [k]: { in: arr } }
          }
        }

        if (value.gt) where[k] = { gt: validate(value.gt) }
        if (value.lt) where[k] = { lt: validate(value.lt) }
        if (value.gte) where[k] = { gte: validate(value.gte) }
        if (value.lte) where[k] = { lte: validate(value.lte) }
        if (value.like)
          where[k] = { contains: validate(value.like), mode: 'insensitive' }
      } else {
        where[k] = validate(value)
      }
    }
  }

  return Object.assign(where, searchQuery)
}

export const parseSort = (querySort: any) => {
  const order: any = []
  if (querySort) {
    const cols = querySort.trim().split(',')
    for (const col of cols) {
      const isDesc = col.charAt(0) === '-'
      const name = isDesc ? col.slice(1) : col
      order.push({ [name]: isDesc ? 'desc' : 'asc' })
    }
    // console.log(order)
  } else {
    order.push({ id: 'asc' })
  }
  return order
}

export const parseInclude = (queryInclude: any) => {
  let relations = {}
  if (queryInclude) {
    // const joinTables = Object.keys(allRelations)
    // const isArray = typeof queryInclude == 'object'
    // if (isArray) {
    //   for (const k of queryInclude) {
    //     if (joinTables.includes(k)) relations[k] = joinTables.includes(k)
    //   }
    // } else {
    //   relations[queryInclude] = true
    // }
  } else {
    // relations = { ...allRelations }
  }
  return relations
}

export const middleware = (req: NextRequest) => {
  return NextResponse.next()
}

export function removeQueryString(str: string) {
  const index = str.indexOf('?')
  if (index !== -1) {
    return str.substring(0, index)
  }
  return str
}

// export const handleProcessFile = async (file: any, oldFile: any) => {
//   if (file) {
//     const fileExtension = path.extname(file.name).toLowerCase()
//     const isGifOrWebM = ['.gif', '.webm'].includes(fileExtension)

//     const publicPath = isGifOrWebM
//       ? path.resolve('./public/videos')
//       : path.resolve('./public/images')
//     let name = ''

// if (oldFile) {
//   name = getFileName(oldFile)
//   const isVideo = ['.mp4', '.webm', '.gif'].some((ext) =>
//     oldFile.includes(ext),
//   )

//   const targetPath = isVideo
//     ? path.resolve('./public/videos')
//     : path.resolve('./public/images')

//   await unlink(path.join(targetPath, oldFile))
// }
// else {
//   name = uuidv4()
// }
//     const newFileName = `${name}${fileExtension}`
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)

//     return { fileName: newFileName, buffer, pathTo: publicPath }
//   }

//   return { fileName: null, buffer: null, pathTo: null }
// }

export const handleProcessFile = async (file: any, oldFile: any) => {
  if (file) {
    const fileExtension = path.extname(file.name).toLowerCase()
    const isGifOrWebM = ['.gif', '.webm'].includes(fileExtension)

    const publicPath = isGifOrWebM
      ? path.resolve('./public/videos')
      : path.resolve('./public/images')

    // Generate a unique name for the file
    const uniqueName = uuidv4()
    const newFileName = `${uniqueName}${fileExtension}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return { fileName: newFileName, buffer, pathTo: publicPath }
  }

  return { fileName: null, buffer: null, pathTo: null }
}

export const formDataToObject = (data: any) => {
  const formDataArray = Array.from(data)
  const outputObject: any = {}
  formDataArray.forEach((entry: any) => {
    if (entry[0] !== 'file') {
      outputObject[entry[0]] = entry[1]
    }
  })
  return outputObject
}

export const capitalize = (text: string) => {
  const regex = /(\b[a-z](?!\s))/g
  return text.replace(regex, function (x: any) {
    return x.toUpperCase()
  })
}
