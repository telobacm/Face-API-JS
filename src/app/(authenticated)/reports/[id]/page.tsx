'use client'
import React, { useEffect, useState } from 'react'
import { useGetList } from '~/services/dashboard'
import NotFoundComponent from '~/components/NotFound'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminLayout from '../../components/layoutAdmin'
import Table from '~/components/Table'

export default function UserReport() {
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const search_keys = 'user.name,user.nip'
  const filtered: any = {
    page: currentPage,
    filter: {
      search: searchValue,
      search_keys: search_keys,
    },
    include: { user: true },
  }

  const {
    data: tableData,
    isLoading,
    isSuccess,
  } = useGetList('reports', filtered)

  const columnDefWithCheckBox = () => [
    {
      accessorKey: 'user.name',
      header: 'Nama',
    },
    {
      accessorKey: 'user.nip',
      header: 'NIP',
    },
    {
      accessorKey: 'user.kampus',
      header: 'Kampus',
    },
    {
      accessorKey: 'user.unit',
      header: 'Unit',
    },
    {
      accessorKey: 'ekspresi',
      header: 'Ekspresi',
    },
    {
      accessorKey: 'isPunctual',
      header: 'Tepat Waktu',
      cell: ({ row }: any) => (
        <span>{row?.original?.isPunctual === 'Tepat Waktu' ? '✅' : '❌'}</span>
      ),
    },
  ]
  // console.log('isLoading', isLoading)

  const showNotFound = isSuccess && !tableData?.length

  const router = useRouter()
  const { status, data: sessionData }: any = useSession()
  const role = sessionData?.user?.role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (status === 'authenticated' && role === 'USER') {
      router.push(`/reports/${sessionData?.user?.id}`)
    }
  }, [status, router, role])

  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        {isLoading && <Loading />}
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[currentPage, setCurrentPage]}
          finalColumnDef={columnDefWithCheckBox()}
          title={'Report'}
          data={tableData}
          showNotFound={showNotFound}
        />
      </AdminLayout>
    )
  )
}
