'use client'
import * as qs from 'qs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './utils'

export const useGetList = (table: string, params: any = {}) => {
  const queryKeys = Object.keys(params)
  const queryString = queryKeys.length
    ? '?' +
      qs.stringify(params, {
        arrayFormat: 'indices',
        encode: false,
        format: 'RFC3986',
      })
    : ''
  return useQuery({
    queryKey: queryKeys.length ? [table, params] : [table],
    queryFn: async () => {
      try {
        const { data } = await api().get(`/${table + queryString}`)
        return data ? data : []
      } catch (error) {
        console.error('useGetList', error)
      }
    },
    initialData: [],
  })
}

export const usePatch = (table: string, params: any = null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: any) => {
      const res = await api().patch(`/${table}/${id ? id : ''}`, payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries(params ? [table, params] : [table])
    },
  })
}

export const useDelete = (table: any, params: any = null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const res = await api().delete(`/${table}/${id}`)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries(params ? [table, params] : [table])
    },
  })
}

export const usePost = (table: any, params: any = null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api().post(`/${table}`, payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries(params ? [table, params] : [table])
    },
  })
}
