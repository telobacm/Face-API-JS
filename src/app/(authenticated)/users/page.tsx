'use client'
import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import Link from 'next/link'
import AdminLayout from '../components/layoutAdmin'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Users() {
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
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
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
  ]

  const showNotFound = isSuccess && !userList?.length

  const router = useRouter()
  const { status, data }: any = useSession()
  const role = data?.user?.role
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && role == 'USER') router.push('/reports')
  }, [status, router, role])

  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        {isLoading && <Loading />}
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
