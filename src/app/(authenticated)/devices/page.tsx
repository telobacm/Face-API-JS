'use client'
import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import AdminLayout from '../components/layoutAdmin'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DeleteItem from '../components/deleteItem'
import AddDevice from './addDevice'
import EditDevice from './editDevice'

export default function Devices() {
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const search_keys = 'kampus.name,unit.name'
  const filtered: any = {
    page: currentPage,
    filter: {
      search: searchValue,
      search_keys: search_keys,
    },
  }

  const {
    data: devices,
    isLoading,
    isSuccess,
  } = useGetList('devices', filtered)
  const { data: thisDevice } = useGetList('address')
  // console.log('thisDevice', thisDevice)

  const columnDefWithCheckBox = () => [
    {
      accessorKey: 'no',
      header: 'No.',
      cell: ({ row }: any) => <span>{row?.index + 1}</span>,
    },
    {
      accessorKey: 'mac',
      header: 'Mac Address',
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
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }: any) => (
        <div className="flex justify-center items-center">
          <EditDevice prop="devices" data={row?.original} />
          <DeleteItem prop="devices" data={row?.original} />
        </div>
      ),
    },
  ]

  const showNotFound = isSuccess && !devices?.length

  const router = useRouter()
  const { status, data }: any = useSession()
  const role = data?.user?.role
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && role !== 'SUPERADMIN')
      router.push('/settings')
  }, [status, router, role])

  if (isLoading) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        <div className="flex justify-between items-start gap-6">
          {!!thisDevice && (
            <div className="grid text-normal gap-1.5">
              {!thisDevice?.deviceInfo?.id && (
                <>
                  <div>
                    <p>
                      Perangkat ini tidak terdaftar untuk mesin presensi, ingin
                      anda daftarkan ?
                    </p>
                    <p>Pilih salah satu mac Address anda untuk didaftarkan</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    Mac adress:{' '}
                    {thisDevice?.macList?.map((x: string, i: number) => (
                      <p key={i}>
                        <span className="font-semibold">{x}</span>
                        {i < thisDevice.macList.length - 1 && ','}
                      </p>
                    ))}
                  </div>
                </>
              )}
              {!!thisDevice?.deviceInfo?.id && (
                <>
                  <div>Perangkat ini terdaftar untuk mesin presensi:</div>
                  <div className="">
                    Kampus:{' '}
                    <span className="font-semibold">
                      {thisDevice?.deviceInfo?.kampus?.name}
                    </span>
                  </div>
                  <div className="">
                    Unit:{' '}
                    <span className="font-semibold">
                      {thisDevice?.deviceInfo?.unit?.name}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          <AddDevice prop="devices" />
        </div>
        <Table
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[currentPage, setCurrentPage]}
          finalColumnDef={columnDefWithCheckBox()}
          title={'device by kampus or unit'}
          data={devices}
          showNotFound={showNotFound}
          showSearchBar={true}
        />
      </AdminLayout>
    )
  )
}
