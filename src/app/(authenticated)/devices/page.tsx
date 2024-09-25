'use client'
import React, { useEffect, useState } from 'react'
import { defaultPage } from '~/components/Pagination'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'
import AdminLayout from '../components/layoutAdmin'
import Loading from '~/components/loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DeleteItem from '../components/deleteItem'
import AddDevice from './addDevice'
import EditDevice from './editDevice'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Devices() {
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(defaultPage)
  const search_keys = 'kampus.name,unit.name'
  const filtered: any = {
    page: page.current,
    filter: {
      search: searchValue,
      search_keys: search_keys,
    },
  }

  const {
    data: devices,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetList('devices', filtered)

  /////  simpan Mac Address di localStorage dan GET /address  /////
  const [thisDevice, setThisDevice] = useState<any>()
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(true)
  const [isStoredMac, setIsStoredMac] = useState<boolean>(false)
  const [macAddress, setMacAddress] = useState<string | null>()
  // const [isSuccessAddress, setIsSuccessAddress] = useState(false)
  // Ambil dan simpan MAC address di localStorage
  const urlParams = new URLSearchParams(window.location.search)
  const receivedMacAddress = urlParams.get('mac_address')
  if (receivedMacAddress) {
    localStorage.setItem('macAddress', receivedMacAddress.toLowerCase())
  }

  // Cek localStorage saat load Home page
  useEffect(() => {
    const storedMacAddress: any = localStorage.getItem('macAddress')
    if (!storedMacAddress) {
      // console.log('Tidak ada Mac Address tersimpan.')
      toast.error('Tidak ada Mac Address tersimpan.')
      setIsLoadingAddress(false)
    } else {
      setMacAddress(storedMacAddress)
      setIsStoredMac(true)

      // AMBIL DATA PERANGKAT PRESENSI DARI DATABASE
      axios
        .get(`/api/address/${storedMacAddress}`)
        .then((response) => {
          setThisDevice(response.data)
          // console.log('res axios', response.data)
          // setIsSuccessAddress(true);
        })
        .catch((error) => {
          console.error('Error fetching data', error)
          // toast.error('Error fetching data', error)
        })
        .finally(() => {
          setIsLoadingAddress(false)
        })
    }
  }, [])
  ///// simpan Mac Address di localStorage dan GET /address /////

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

  if (isLoading || isLoadingAddress) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        <div className="flex justify-between items-start gap-6">
          <div className="grid text-normal gap-1.5">
            {!isStoredMac ? (
              // KETIKA TIDAK ADA MAC ADDRESS DI LOCAL STORAGE
              <p>Mac Address tidak terdeteksi.</p>
            ) : (
              // KETIKA ADA MAC ADDRESS DI LOCAL STORAGE, TAPI TIDAK COCOK DENGAN DATABASE DEVICES
              <>
                {!thisDevice?.id && (
                  <>
                    <div>
                      Perangkat ini tidak terdaftar untuk mesin presensi, ingin
                      anda daftarkan ?
                    </div>
                    <div className="flex flex-wrap gap-2">
                      Mac adress:{' '}
                      <span className="font-semibold">{macAddress}</span>
                    </div>
                  </>
                )}
              </>
            )}

            {!!isStoredMac && !!thisDevice?.id && (
              <>
                <div>Perangkat ini terdaftar untuk mesin presensi:</div>
                <div className="">
                  Kampus:{' '}
                  <span className="font-semibold">
                    {thisDevice?.kampus?.name}
                  </span>
                </div>
                <div className="">
                  Unit:{' '}
                  <span className="font-semibold">
                    {thisDevice?.unit?.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  Mac adress:{' '}
                  <span className="font-semibold">{macAddress}</span>
                </div>
              </>
            )}
          </div>
          <AddDevice prop="devices" />
        </div>
        <Table
          loading={isLoading || isFetching}
          columns={columnDefWithCheckBox()}
          searchValueProps={[searchValue, setSearchValue]}
          currentPageProps={[page, setPage]}
          title={'Devices'}
          searchby={'device by kampus or unit'}
          data={devices}
          showNotFound={showNotFound}
          showSearchBar={true}
        />
      </AdminLayout>
    )
  )
}
