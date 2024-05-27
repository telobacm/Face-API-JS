'use client'
import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import Link from 'next/link'
import AdminLayout from '../components/layoutAdmin'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BiSolidUserDetail } from 'react-icons/bi'
import { Tooltip } from '@nextui-org/react'

export default function Users(session: any) {
  console.log('session', session)

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

  const columnDefWithCheckBox = () => [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }: any) => (
        <Link href={`users/${row?.original?.id}`}>{row?.original?.name}</Link>
      ),
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
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'password',
      header: 'Password',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }: any) => (
        // <Tooltip content="detail" color="secondary">
        <div className="flex justify-center">
          <Link href={`users/${row?.original?.id}`}>
            <div className="w-fit p-2.5 -m-2 rounded-lg hover:bg-blue-400 text-black hover:text-blue-100">
              <BiSolidUserDetail />
            </div>
          </Link>
        </div>
        // </Tooltip>
      ),
    },
  ]

  const showNotFound = isSuccess && !userList?.length

  const router = useRouter()
  const { status, data }: any = useSession()
  const role = data?.user?.role
  useEffect(() => {
    console.log('status', status)

    if (status !== 'loading') {
      if (status === 'unauthenticated') {
        router.push('/login')
      }
      if (status === 'authenticated' && role == 'USER') {
        router.push('/settings')
      }
    }
  }, [status, router, role])

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
          title={'User'}
          data={userList}
          showNotFound={showNotFound}
        />
      </AdminLayout>
    )
  )
}
