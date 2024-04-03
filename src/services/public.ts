import * as qs from 'qs'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
const API_URL = NEXT_PUBLIC_API_URL?.endsWith('/')
  ? NEXT_PUBLIC_API_URL + 'api/'
  : NEXT_PUBLIC_API_URL + '/api/'

export const handleFetch = async (table: any, params: any = {}) => {
  try {
    const queryKeys = Object.keys(params)

    const queryString = queryKeys.length
      ? '?' +
        qs.stringify(params, {
          arrayFormat: 'indices',
          encode: false,
          format: 'RFC3986',
        })
      : ''

    let initData: any = []
    switch (table) {
      case 'content':
        initData = []
        break

      case 'media':
        initData = []
        break
    }

    const res = await fetch(API_URL + table + queryString, {
      cache: 'no-store',
    })
    if (res.ok) {
      const resData = await res.json()

      if (resData.length) {
        initData = resData
      }
    }

    return initData
  } catch (error) {
    console.error('handleFetch', error)
  }
}
