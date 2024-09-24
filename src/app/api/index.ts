import { NextRequest, NextResponse } from 'next/server'

type obj = { [key: string]: any }

interface SearchFilter {
  search: string
  keys: string
}

interface ContainsFilter {
  contains: string
  // mode: 'insensitive';
}

interface KeyObject {
  [key: string]: KeyObject | ContainsFilter
}

interface QueryFilterResult {
  OR?: KeyObject[]
}

export const BadRequest = (message: string) =>
  NextResponse.json({ message }, { status: 400 })

const isDev = process.env.NODE_ENV == 'development'
export const headers = { 'Content-Type': 'application/json' }

export const handleError = (error: any) => {
  console.error(`[ERROR]`, error)
  const message = error?.stack?.split('\n', 2)?.join('\n')
  const object: any = { code: error.code }

  // if (isDev) {
  object.name = error.name
  object.message = error.message
  object.stack = error.stack
  // } else {
  //   object.error = 'Internal Server Error';
  // }

  if (error.code === 'P2002') {
    // const uniqueFields = (error?.meta?.target as string[]).join(', ');
    const uniqueFields = error?.meta?.target as string[]
    object.message = `${uniqueFields} was registered! Expected unique ${uniqueFields}`
  }

  if (error.code === 'P2025' || error.name === 'NotFoundError') {
    return NextResponse.json(object, { status: 404 })
  } else {
    return NextResponse.json(object, { status: 500 })
  }
}

export const validate = (value: any) => {
  if (!isNaN(value)) value = parseInt(value)
  if (value == 'true') value = true
  if (value == 'false') value = false
  if (value == 'null') value = null
  if (value == 'undefined') value = undefined
  return value
}

const handleQuerySearch = (queryFilter: SearchFilter): QueryFilterResult => {
  const { search, keys } = queryFilter
  if (search && keys) {
    const searchValues = search.split(',')
    const Keys = keys.split(',')

    const createObject = (
      keysArray: string[],
      searchValue: string,
    ): KeyObject => {
      const key = keysArray[0]
      const remainingKeys = keysArray.slice(1)
      if (remainingKeys.length === 0) {
        // return { [key]: { contains: searchValue, mode: 'insensitive' } };
        return { [key]: { contains: searchValue } }
      }
      return { [key]: createObject(remainingKeys, searchValue) }
    }
    const transformedKeys = Keys.flatMap((key) => {
      const keyArray = key.split('.')
      return searchValues.map((searchValue) =>
        createObject(keyArray, searchValue),
      )
    })
    return { OR: transformedKeys }
  }
  return {}
}

export const parseFilter = (QFilter: any) => {
  const where: any = {}
  let searchQuery = {}
  if (QFilter) {
    const { page, take, sort, ...queryFilter } = QFilter
    removeEmptyStringFromObj(queryFilter)
    if (queryFilter.search && queryFilter.keys) {
      searchQuery = handleQuerySearch(queryFilter)
    }
    delete queryFilter.search
    delete queryFilter.keys

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
        if (!operators.includes(k)) {
          const nestedFilters = parseFilter(value)
          where[k] = { ...nestedFilters }
        }
        if (value.between) {
          const [val1, val2] = value.between?.split(',')
          where[k] = { gte: val1, lte: val2 }
        }
        if (value.in) {
          const arr = value.in?.split(',').map((x: any) => validate(x))
          where[k] = { in: arr }
        }
        // if (value.not) {
        //   const arr = value.not?.split(',').map((x: any) => validate(x));
        //   if (where.NOT) {
        //     where.NOT = { ...where.NOT, [k]: { in: arr } };
        //   } else {
        //     where.NOT = { [k]: { in: arr } };
        //   }
        // }

        if (value.gt) where[k] = { gt: validate(value.gt) }
        if (value.lt) where[k] = { lt: validate(value.lt) }
        if (value.gte) where[k] = { gte: validate(value.gte) }
        if (value.lte) where[k] = { lte: validate(value.lte) }
        if (value.like)
          // where[k] = { contains: validate(value.like), mode: 'insensitive' };
          where[k] = { contains: validate(value.like) }
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
  } else {
    order.push({ id: 'asc' })
  }
  return order
}
export const sortingDataWithParams = (querySort: any, params: any) => {
  if (querySort) {
    if (Array.isArray(querySort)) {
      for (const sort of querySort) {
        if (sort && typeof sort === 'object') {
          for (const key of Object.keys(sort)) {
            const isDesc = sort[key].charAt(0) === '-'
            const name = isDesc ? sort[key].slice(1) : sort[key]
            params.include[key] = {
              ...params.include[key],
              orderBy: { [name]: isDesc ? 'desc' : 'asc' },
            }
          }
        } else {
          params.orderBy = parseSort(sort)
        }
      }
    } else {
      if (querySort && typeof querySort === 'object') {
        for (const key of Object.keys(querySort)) {
          const isDesc = querySort[key].charAt(0) === '-'
          const name = isDesc ? querySort[key].slice(1) : querySort[key]
          params.include[key] = {
            ...params.include[key],
            orderBy: { [name]: isDesc ? 'desc' : 'asc' },
          }
        }
      } else {
        params.orderBy = parseSort(querySort)
      }
    }
  }
  return params
}

export function parseInclude(
  data: string | Record<string, any>,
): Record<string, any> {
  if (typeof data === 'string') {
    // Case 1: data is a comma-separated string
    return data
      .split(',')
      .reduce((acc: Record<string, boolean>, item: string) => {
        acc[item.trim()] = true
        return acc
      }, {})
  } else if (typeof data === 'object' && !Array.isArray(data)) {
    // Case 2: data is an object
    const parseObject = (obj: Record<string, any>): Record<string, any> => {
      const result: Record<string, any> = {}
      for (const key in obj) {
        if (
          typeof obj[key] === 'string' &&
          (obj[key] === 'true' || obj[key] === 'false')
        ) {
          result[key] = obj[key] === 'true'
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          result[key] = parseObject(obj[key])
        } else {
          result[key] = obj[key]
        }
      }
      return result
    }
    return parseObject(data)
  } else {
    // If data is neither a string nor an object, return it as is
    return data
  }
}

type AnyObject = { [key: string]: any }

export function mergeObjects(obj1: AnyObject, obj2: AnyObject): AnyObject {
  const merged: AnyObject = {}

  for (const key in obj1) {
    if (key === 'OR' && Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      merged[key] = obj1[key].concat(obj2[key])
    } else if (
      typeof obj1[key] === 'object' &&
      typeof obj2[key] === 'object' &&
      !Array.isArray(obj1[key]) &&
      !Array.isArray(obj2[key])
    ) {
      merged[key] = mergeObjects(obj1[key], obj2[key])
    } else {
      merged[key] = obj2.hasOwnProperty(key) ? obj2[key] : obj1[key]
    }
  }

  for (const key in obj2) {
    if (!(key in obj1)) {
      merged[key] = obj2[key]
    }
  }

  return merged
}

export const exclude = (arr: obj[], keysToExclude: string[]) => {
  return arr.map((item) => {
    const newItem: obj = {}
    for (const key in item) {
      if (!keysToExclude.includes(key)) {
        newItem[key] = item[key]
      }
    }
    return newItem
  })
}

export function getUserValue(obj: any) {
  for (const key in obj) {
    if (key === 'user') {
      return obj[key]
    } else if (typeof obj[key] === 'object') {
      const userValue: any = getUserValue(obj[key])
      if (userValue) {
        return userValue
      }
    }
  }
  return null
}

export const removeEmptyStringFromObj = (obj: obj) => {
  for (const key in obj) {
    if (obj[key] === '') {
      delete obj[key]
    }
  }
}

export function isObjectEmpty(obj: obj) {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return true
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}
