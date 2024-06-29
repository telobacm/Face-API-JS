'use client'
import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import AdminLayout from '../components/layoutAdmin'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import EditUser from './editUser'

export default function Users(session: any) {
  const router = useRouter()
  const { status, data }: any = useSession()
  const role = data?.user?.role

  useEffect(() => {
    if (status !== 'loading') {
      if (status === 'unauthenticated') {
        router.push('/login')
      }
      if (status === 'authenticated' && role == 'USER') {
        router.push('/settings')
      }
    }
  }, [status, router, role])

  useEffect(() => {
    const toastMessage = sessionStorage.getItem('toastMessage')
    if (toastMessage) {
      toast.success(toastMessage)
      sessionStorage.removeItem('toastMessage')
    }
  }, [])

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const search_keys = 'name,nip'
  const filtered: any = {
    page: currentPage,
    filter: {
      search: searchValue,
      search_keys: search_keys,
    },
  }

  const { data: userList, isLoading, isSuccess } = useGetList('users', filtered)

  const columnArray = [
    {
      accessorKey: 'no',
      header: 'No.',
      cell: ({ row }: any) => <span>{row?.index + 1}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Nama',
    },
    {
      accessorKey: 'nip',
      header: 'NIP',
    },
    {
      accessorKey: 'kampus',
      header: 'Kampus',
      cell: ({ row }: any) => <span>{row?.original?.kampus?.name}</span>,
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ row }: any) => <span>{row?.original?.unit?.name}</span>,
    },
    {
      accessorKey: 'position',
      header: 'Jabatan',
      cell: ({ row }: any) => (
        <span>
          {row?.original?.position?.charAt(0) +
            row?.original?.position?.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }: any) => (
        <span>
          {row?.original?.role?.charAt(0) +
            row?.original?.role?.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: 'whitelist',
      header: 'Whitelist',
      cell: ({ row }: any) => (
        <div className="flex justify-center">
          <span>{row?.original?.whitelist ? 'Whitelist' : 'Bukan'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }: any) => (
        <div className="flex justify-center">
          <EditUser data={row?.original} role={role} />
        </div>
      ),
    },
  ]

  const columnDefWithCheckBox = () => {
    if (role === 'SUPERADMIN') {
      return columnArray
    } else {
      return columnArray.filter(
        (column) =>
          column.accessorKey !== 'kampus' && column.accessorKey !== 'unit',
      )
    }
  }

  const showNotFound = isSuccess && !userList?.length

  if (isLoading) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[currentPage, setCurrentPage]}
          finalColumnDef={columnDefWithCheckBox()}
          title={'user by name or nip'}
          data={userList}
          showNotFound={showNotFound}
          showSearchBar={true}
        />
      </AdminLayout>
    )
  )
}
