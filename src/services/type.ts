export type mutationParams = {
  invalidateKeys?: string[]
  isPublic?: boolean
}

export type listParams = {
  queryParams?: queryParams
  skip?: boolean
  isPublic?: boolean
  keys?: string[]
}

export type anyGetParams = {
  queryParams?: anyGetQueryParams
  skip?: boolean
  isPublic?: boolean
  keys?: string[]
}

export type filterQuery = {
  search?: string
  keys?: string
  [key: string]: any
}

export type anyGetQueryParams = {
  // EDIT SESUAI DIBUTUHKAN
  [key: string]: any
}

export type queryParams = filterQuery & {
  take?: number
  page?: number
  sort?: string
  select?: string
  search?: string
}

export type metaResponse = {
  count: number
  take: number
  page: number
  pageCount: number
}

export type listResult = {
  data: any[]
  meta: metaResponse
}

export type listResultInfinite = {
  pageParams: number[]
  pages: listResult[]
}

export type error =
  | {
      response?: {
        data?: { message?: string; [key: string]: any }
        [key: string]: any
      }
      [key: string]: any
    }
  | any
