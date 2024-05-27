'use client'
import React, { useEffect, useState } from 'react'
import { useGetList } from '~/services/dashboard'
import NotFoundComponent from '~/components/NotFound'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminLayout from '../../components/layoutAdmin'
import Table from '~/components/Table'
import Link from 'next/link'
import { BiChevronLeft } from 'react-icons/bi'
import dayjs from 'dayjs'
import PieChart from '../../components/PieChart'
import 'dayjs/locale/id'

dayjs.locale('id')

export default function UserReport(props: any) {
  const router = useRouter()
  const { data: sessionData, status }: any = useSession()
  const role = sessionData?.user?.role
  const userId = props?.params?.id
  // console.log('props?.params', props?.params)

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // GET user/id include reports[]
  const filterUser: any = {
    page: currentPage,
    filter: {
      // search: searchValue,
      // search_keys: search_keys,
    },
    include: {
      reports: true,
    },
  }
  const {
    data: tableData,
    isLoading,
    isSuccess,
  } = useGetList(`users/${userId}`, filterUser)
  console.log('tableData', tableData)

  const columnDefWithCheckBox = () => [
    {
      accessorKey: 'number',
      header: 'No.',
      cell: ({ row }: any) => <span>{row.index + 1}</span>,
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
      accessorKey: 'enterExit',
      header: 'Masuk/Keluar',
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

  const showNotFound = isSuccess && !tableData?.reports?.length

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router, role])

  if (isLoading) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        {role !== 'USER' && (
          <Link
            href="reports/"
            className="flex items-center w-fit text-lg font-semibold mb-3 hover:font-bold text-black hover:text-red-600"
          >
            <BiChevronLeft /> Back
          </Link>
        )}
        <div className="flex justify-end gap-6">
          <PieChart
            data={tableData?.reports}
            counted="ekspresi"
            label="Chart Ekspresi"
          />
        </div>
        {tableData && (
          <>
            <div className="text-2xl font-semibold text-black mb-2">
              User Report
            </div>
            <div className="grid gap-2">
              <div className="flex">
                <div className="">Name : </div>
                <div className="ml-4 font-semibold">{tableData?.name}</div>
              </div>
              <div className="flex">
                <div className="">Email : </div>
                <div className="ml-4 font-semibold">{tableData?.email}</div>
              </div>
              <div className="flex">
                <div className="">NIP : </div>
                <div className="ml-4 font-semibold">{tableData?.nip}</div>
              </div>
              <div className="flex">
                <div className="">Position : </div>
                <div className="ml-4 font-semibold">{tableData?.position}</div>
              </div>
              <div className="flex">
                <div className="">Kampus : </div>
                <div className="ml-4 font-semibold">
                  {tableData?.kampus?.name}
                </div>
              </div>
              <div className="flex">
                <div className="">Unit : </div>
                <div className="ml-4 font-semibold">
                  {tableData?.unit?.name}
                </div>
              </div>
              {!!tableData?.subunit?.length && (
                <div className="flex">
                  <div className="">SubUnit : </div>
                  <div className="ml-4 font-semibold">
                    {tableData?.subunit?.name}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[currentPage, setCurrentPage]}
          finalColumnDef={columnDefWithCheckBox()}
          title={'Report'}
          data={tableData?.reports}
          showNotFound={showNotFound}
        />
      </AdminLayout>
    )
  )
}
