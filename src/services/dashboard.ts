'use client'
import * as qs from 'qs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './utils'
import { toast } from 'react-toastify'

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
    queryKey: params ? [table, params] : [table],
    queryFn: async () => {
      try {
        const { data } = await api().get(`/${table + queryString}`)
        return data ? data : []
      } catch (error) {
        console.error('useGetList', error)
      }
    },
    // initialData: [],
  })
}

export const usePatch = (table: string, params: any = null) => {
  const queryClient = useQueryClient()
  let mac = <string | null>null
  return useMutation({
    mutationFn: async ({ id, payload }: any) => {
      // mac = payload?.mac
      const res = await api().patch(`/${table}/${id ? id : ''}`, payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries(params ? [table, params] : [table])
      // JIKA TERJADI PATCH PADA /devices, MAKA CEK JUGA PERUBAHAN DI /address
      if (table == 'devices') {
        queryClient.invalidateQueries(['address'])
        // queryClient.invalidateQueries([`address/[${mac}]`])
      }
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
    onError: (error: any) => {
      // if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message)
      // }
    },
  })
}
