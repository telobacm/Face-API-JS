'use client'
import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import AdminLayout from '../components/layoutAdmin'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import PieChart from '../components/PieChart'
import { BiSolidUserDetail } from 'react-icons/bi'
import Link from 'next/link'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

export default function Reports() {
  // CEK ROLE
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
  // GET data kampus dan unit
  const { data: kampus, isLoading: isLoadingKampus } = useGetList('kampus')
  const { data: units, isLoading: isLoadingUnits } = useGetList('unit')
  //filter unit
  const [filterKampus, setFilterKampus] = useState<any>()
  const [filterUnit, setFilterUnit] = useState<any>()
  //filter datetime
  const [filterType, setFilterType] = useState('monthly')
  const [month, setMonth] = useState<any>()
  const [week, setWeek] = useState<any>()
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()

  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const search_keys = 'user.name,user.nip'
  const [filtered, SetFiltered] = useState({
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
  })

  useEffect(() => {
    let newFilter: any = { ...filtered }
    newFilter.filter.search = searchValue
    SetFiltered(newFilter)
  }, [searchValue])

  const handleFilterTypeChange = (e: any) => setFilterType(e.target.value)

  const handleApplyFilters = () => {
    let newFilter: any = { ...filtered }
    if (filterType === 'monthly' && !!month) {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)
      newFilter.filter.timestamp = {
        between: `${startOfMonth.toISOString()},${endOfMonth.toISOString()}`,
      }
    } else if (filterType === 'weekly' && !!week) {
      const [tahun, pekan]: any = week.split('-W')
      const tanggal = new Date(`${tahun}-01-01`)
      tanggal.setDate(tanggal.getDate() + (pekan - 1) * 7)
      console.log('tanggal', tanggal)

      const startOfWeek = new Date(
        tanggal.getFullYear(),
        tanggal.getMonth(),
        tanggal.getDate(),
      )
      const endOfWeek = new Date(
        tanggal.getFullYear(),
        tanggal.getMonth(),
        tanggal.getDate() + 6,
      )
      newFilter.filter.timestamp = {
        between: `${startOfWeek.toISOString()},${endOfWeek.toISOString()}`,
      }
    } else if (filterType === 'dateRange' && !!startDate && !!endDate) {
      newFilter.filter.timestamp = {
        between: `${startDate.toISOString()},${endDate.toISOString()}`,
      }
    }
    if (!!filterKampus) {
      newFilter.filter = {
        ...newFilter.filter,
        user: { kampusId: parseInt(filterKampus) },
      }
    }
    if (!!filterKampus && !!filterUnit) {
      newFilter.filter = {
        ...newFilter.filter,
        user: { unitId: parseInt(filterUnit) },
      }
    }
    SetFiltered(newFilter)
  }

  const handleClearFilters = () => {
    setFilterType('monthly')
    setFilterKampus(undefined)
    setFilterUnit(null)
    setMonth(null)
    setWeek(null)
    setStartDate(null)
    setEndDate(null)
    const initialFilter = {
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
    SetFiltered(initialFilter)
  }

  const {
    data: tableData,
    isLoading: isLoadingReports,
    isSuccess,
  } = useGetList('reports', filtered)
  const columnArray = [
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
            src={`uploads/${row?.original?.image}`}
            alt="report photo"
          />
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

  const showNotFound = isSuccess && !tableData?.length
  const isLoading = isLoadingReports && isLoadingKampus && isLoadingUnits
  if (isLoading) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        <div className="grid lg:flex justify-between">
          {/* FILTERS */}
          <div className="grid content-start gap-x-8 gap-y-6 flex-wrap">
            {/* FILTER UNIT */}
            {role === 'SUPERADMIN' ? (
              <div className="grid gap-1.5 content-start">
                <p className="font-medium">Filter by Unit</p>
                <div>
                  <label className="mb-0.5 text-sm">Kampus</label>
                  <div className="relative">
                    <select
                      required
                      name="kampus"
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={filterKampus || ''}
                      onChange={(e) => setFilterKampus(e.target.value)}
                    >
                      <option
                        value=""
                        disabled
                        selected
                        hidden
                        className="text-gray-400"
                      >
                        Pilih Kampus
                      </option>
                      {!!kampus?.length &&
                        kampus?.map((x: any, i: number) => (
                          <option key={i} value={x?.id}>
                            {x?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-0.5 text-sm">Unit</label>
                  <div className="relative">
                    <select
                      required
                      name="unit"
                      value={filterUnit || ''}
                      onChange={(e) => setFilterUnit(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      disabled={!filterKampus}
                    >
                      <option
                        value=""
                        disabled
                        selected
                        hidden
                        className="text-gray-400"
                      >
                        Pilih Unit
                      </option>
                      {!!units?.length &&
                        units?.map((x: any, i: number) => (
                          <option key={i} value={x.id + '/' + x.name}>
                            {x?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            {/* FILTER DATE */}
            <div className="grid gap-1.5 content-start">
              <p className="font-medium">Filter by Date</p>
              <div className="grid">
                <label className="mb-0.5 text-sm">Rentang waktu</label>
                <select
                  className="w-64 rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                >
                  <option value="monthly">Bulanan</option>
                  <option value="weekly">Mingguan</option>
                  <option value="dateRange">Date Range</option>
                </select>
              </div>

              {filterType === 'monthly' && (
                <div className="grid">
                  <label className="mb-0.5 text-sm">Pilih Bulan</label>
                  <input
                    name="month"
                    className="w-64 rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={
                      !!month
                        ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
                        : ''
                    }
                    type="month"
                    onChange={(e) => setMonth(new Date(e.target.value))}
                  />
                </div>
              )}

              {filterType === 'weekly' && (
                <div className="grid">
                  <label className="mb-0.5 text-sm">Pilih Pekan</label>
                  <input
                    className="w-64 rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    type="week"
                    onChange={(e) => setWeek(e.target.value)}
                  />
                </div>
              )}

              {filterType === 'dateRange' && (
                <div className="grid">
                  <div className="flex items-center justify-between gap-2">
                    <label className="mb-0.5 text-sm">
                      Tanggal mulai
                      <input
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        type="date"
                        onChange={(e) => {
                          setStartDate(new Date(e.target.value))
                        }}
                      />
                    </label>
                    <b>_</b>
                    <label className="mb-0.5 text-sm">
                      Tanggal akhir
                      <input
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        type="date"
                        onChange={(e) => {
                          setEndDate(new Date(e.target.value))
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex w-full items-center justify-evenly gap-2">
                    <p>
                      {!!startDate
                        ? dayjs(startDate).format('DD MMMM YYYY')
                        : '-'}
                    </p>
                    <span>-</span>
                    <p>
                      {!!endDate ? dayjs(endDate).format('DD MMMM YYYY') : '-'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="w-fit py-1.5 px-3 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
              <button
                className="w-fit py-1.5 px-3 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-600"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
          <div className="flex-none">
            {!!tableData ? (
              <PieChart
                data={tableData}
                counted="ekspresi"
                label="Chart Ekspresi"
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[currentPage, setCurrentPage]}
          finalColumnDef={columnDefWithCheckBox()}
          title={'by user name or nip'}
          data={tableData}
          showNotFound={showNotFound}
          showSearchBar={true}
        />
      </AdminLayout>
    )
  )
}
