'use client'
import React, { useEffect, useState } from 'react'
import { defaultPage } from '~/components/Pagination'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import AdminLayout from '../components/layoutAdmin'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { BiSolidPencil } from 'react-icons/bi'
import Link from 'next/link'

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

  const [searchValue, setSearchValue] = useState<string>('')
  const [page, setPage] = useState(defaultPage)
  const search_keys = 'name,nip'
  const filtered: any = {
    page: page.current,
    filter: {
      search: searchValue,
      search_keys: search_keys,
      isDeleted: false,
    },
  }

console.log('page',filtered.page);

  const {
    data: userList,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetList('users', filtered)

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
          <Link href={`users/${row?.original?.id}`}>
            <button className="w-fit p-2.5 -m-2 rounded-lg hover:bg-blue-400 text-black hover:text-blue-100">
              <BiSolidPencil />
            </button>
          </Link>
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
          loading={isLoading || isFetching}
          columns={columnDefWithCheckBox()}
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[page, setPage]}
          title={'Users'}
          searchby={'user by name or nip'}
          data={userList}
          showNotFound={showNotFound}
          showSearchBar={true}
        />
      </AdminLayout>
    )
  )
}
