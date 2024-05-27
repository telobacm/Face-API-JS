'use client'
import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import AdminLayout from '../components/layoutAdmin'
import NotFoundComponent from '~/components/NotFound'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Doughnut } from 'react-chartjs-2'
import PieChart from '../components/PieChart'

export default function Reports() {
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const search_keys = 'user.name,user.nip'
  const filtered: any = {
    page: currentPage,
    filter: {
      search: searchValue,
      search_keys: search_keys,
    },
    include: {
      user: {
        include: {
          kampus: true,
          unit: true,
          subunit: true,
        },
      },
    },
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
      accessorKey: 'kampus',
      header: 'Kampus',
      cell: ({ row }: any) => <span>{row?.original?.user?.kampus?.name}</span>,
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ row }: any) => <span>{row?.original?.user?.unit?.name}</span>,
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

  if (isLoading) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        <div className="flex justify-end gap-6">
          <PieChart
            data={tableData}
            counted="ekspresi"
            label="Chart Ekspresi"
          />
          <PieChart
            data={tableData}
            counted="isPunctual"
            label="Chart Tepat Waktu"
          />
        </div>
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
