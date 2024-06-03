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
import { BiSolidUserDetail } from 'react-icons/bi'
import Link from 'next/link'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

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
    sort: '-timestamp',
  }

  const {
    data: tableData,
    isLoading,
    isSuccess,
  } = useGetList('reports', filtered)

  const columnDefWithCheckBox = () => [
    {
      accessorKey: 'no',
      header: 'No.',
      cell: ({ row }: any) => <span>{row?.index + 1}</span>,
    },
    {
      accessorKey: 'user.name',
      header: 'Nama',
      cell: ({ row }: any) => (
        <div className="flex justify-between">
          <span>{row?.original?.user?.name}</span>
          <Link href={`reports/${row?.original?.user?.id}`}>
            <div className="w-fit p-2.5 -m-2 rounded-lg hover:bg-blue-400 text-black hover:text-blue-100">
              <BiSolidUserDetail />
            </div>
          </Link>
        </div>
      ),
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
      accessorKey: 'enterExit',
      header: 'Masuk/Pulang',
    },
    {
      accessorKey: 'timestamp',
      header: 'Tanggal',
      cell: ({ cell }: any) => {
        const date = dayjs(cell.getValue())
        return date.format('dddd, DD MMMM YYYY')
      },
    },
    {
      accessorKey: 'timestamp',
      header: 'Jam',
      cell: ({ cell }: any) => {
        const date = dayjs(cell.getValue())
        return date.format('HH:mm:ss')
      },
    },
    {
      accessorKey: 'isPunctual',
      header: 'Tepat Waktu',
      cell: ({ row }: any) => (
        <span className="pl-3">
          {row?.original?.isPunctual === 'Tepat Waktu' ? '✅' : '❌'}
        </span>
      ),
    },
    {
      accessorKey: 'ekspresi',
      header: 'Ekspresi',
    },
    {
      accessorKey: 'foto',
      header: 'Foto',
      cell: ({ row }: any) => <span></span>,
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
          {/* <PieChart
            data={tableData}
            counted="ekspresi"
            label="Chart Ekspresi"
          /> */}
        </div>
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[currentPage, setCurrentPage]}
          finalColumnDef={columnDefWithCheckBox()}
          title={'Report'}
          data={tableData}
          showNotFound={showNotFound}
          showSearchBar={true}
        />
      </AdminLayout>
    )
  )
}
