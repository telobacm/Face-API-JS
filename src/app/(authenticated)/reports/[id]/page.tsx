'use client'
import React, { useEffect, useState } from 'react'
import { useGetList } from '~/services/dashboard'
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

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  // const search_keys = 'ekspresi'

  // GET user/id untuk info user
  const { data: user, isLoading: isLoadingUser } = useGetList(`users/${userId}`)

  // GET reports per user
  const filterReports: any = {
    page: currentPage,
    filter: {
      userId: userId,
      // search: searchValue,
      // search_keys: search_keys,
    },
    sort: '-timestamp',
  }

  const {
    data: reports,
    isLoading: isLoadingReports,
    isSuccess: isSuccessReports,
  } = useGetList('reports', filterReports)

  const columnDefWithCheckBox = () => [
    {
      accessorKey: 'number',
      header: 'No.',
      cell: ({ row }: any) => <span>{row?.index + 1}</span>,
    },
    {
      accessorKey: 'timestamp-date',
      header: 'Tanggal',
      cell: ({ row }: any) => {
        const date = dayjs(row?.original?.timestamp)
        return date.format('dddd, DD MMMM YYYY')
      },
    },
    {
      accessorKey: 'timestamp-hour',
      header: 'Jam',
      cell: ({ row }: any) => {
        const hour = dayjs(row?.original?.timestamp)
        return hour.format('HH:mm:ss')
      },
    },
    {
      accessorKey: 'enterExit',
      header: 'Masuk/Pulang',
    },
    {
      accessorKey: 'isPunctual',
      header: 'Tepat Waktu',
      cell: ({ cell }: any) => (
        <span className="pl-3">
          {cell.getValue() === 'Tepat Waktu'
            ? '✅'
            : cell.getValue() === 'Terlambat'
              ? '❌'
              : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'ekspresi',
      header: 'Ekspresi',
    },
    {
      accessorKey: 'image',
      header: 'Foto',
      cell: ({ row }: any) => (
        <div className="w-48">
          <img
            className="w-48 h-36"
            loading="lazy"
            src={`${process.env.NEXT_PUBLIC_API_URL}/images/${row?.original?.image}`}
            alt=""
          />
        </div>
      ),
    },
  ]

  const showNotFound = isSuccessReports && !reports?.length

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router, role])

  if (isLoadingUser || isLoadingReports) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        {role !== 'USER' && (
          <Link
            href="./"
            className="flex items-center w-fit text-lg font-semibold mb-3 hover:font-bold text-black hover:text-red-600"
          >
            <BiChevronLeft /> Back
          </Link>
        )}
        <div className="grid md:flex justify-between items-start gap-4">
          {user && (
            <div className=" grid content-start gap-2 flex-wrap">
              <div className="text-2xl font-semibold text-black mb-2">
                User Report
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-2 2xl:col-span-1">Name</div>
                <div className="col-span-10 2xl:col-span-11 font-semibold">
                  : {user?.name}
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-2 2xl:col-span-1">Email</div>
                <div className="col-span-10 2xl:col-span-11 font-semibold">
                  : {user?.email}
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-2 2xl:col-span-1">NIP</div>
                <div className="col-span-10 2xl:col-span-11 font-semibold">
                  : {user?.nip}
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-2 2xl:col-span-1">Gender</div>
                <div className="col-span-10 2xl:col-span-11 font-semibold">
                  : {user?.gender}
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-2 2xl:col-span-1">Jabatan</div>
                <div className="col-span-10 2xl:col-span-11 font-semibold">
                  :{' '}
                  {user?.position.charAt(0) +
                    user?.position.slice(1).toLowerCase()}
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-2 2xl:col-span-1">Kampus</div>
                <div className="col-span-10 2xl:col-span-11 font-semibold">
                  : {user?.kampus?.name}
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-2 2xl:col-span-1">Unit</div>
                <div className="col-span-10 2xl:col-span-11 font-semibold">
                  : {user?.unit?.name}
                </div>
              </div>
              {!!user?.subunit?.length && (
                <div className="grid grid-cols-12">
                  <div className="col-span-2 2xl:col-span-1">SubUnit</div>
                  <div className="col-span-10 2xl:col-span-11 font-semibold">
                    : {user?.subunit?.name}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="">
            {!!reports && (
              <PieChart
                data={reports}
                counted="ekspresi"
                label="Chart Ekspresi"
              />
            )}
          </div>
        </div>
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[currentPage, setCurrentPage]}
          finalColumnDef={columnDefWithCheckBox()}
          title={'Report'}
          data={reports}
          showNotFound={showNotFound}
          showSearchBar={false}
        />
      </AdminLayout>
    )
  )
}
