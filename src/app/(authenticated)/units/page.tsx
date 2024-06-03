'use client'
import React, { useEffect } from 'react'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import CharLimit from '~/components/charLimit'
import { useGetList } from '~/services/dashboard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '~/components/loading'
import AddUnit from './addUnit'
import EditUnit from './editUnit'
import DeleteItem from '../components/deleteItem'

export default function Page() {
  const { data: kampus, isLoading: isLoadingKampus } = useGetList('kampus')
  const { data: unit, isLoading: isLoadingUnit } = useGetList('unit')
  const { data: subunit, isLoading: isLoadingSubunit } = useGetList('subunit')
  const router = useRouter()
  const { status, data: sessionData }: any = useSession()
  const role = sessionData?.user?.role
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && role !== 'SUPERADMIN')
      router.push('/reports')
    if (status === 'authenticated' && role === 'USER')
      router.push(`/reports/${sessionData?.user?.id}`)
  }, [status, router, role])
  const isLoading = isLoadingKampus && isLoadingUnit && isLoadingSubunit

  if (isLoading) {
    return <Loading />
  }
  return (
    <AdminLayout>
      {/* KAMPUS */}
      <div className="mb-16">
        <div className="flex justify-between mb-5">
          <div className="text-2xl font-bold">Kampus</div>
          <AddUnit prop="kampus" />
        </div>
        <div className="bg-white">
          <div className="max-w-full overflow-x-auto">
            <table className="  w-full">
              <thead className=" bg-gray-900 text-gray-50">
                <tr>
                  <th className="px-2 py-3 lg:p-5 w-1/12">No</th>
                  <th className="px-2 py-3 lg:p-5 w-1/12">id</th>
                  <th className="px-2 py-3 lg:p-5 w-full">Name</th>
                  <th className="px-2 py-3 lg:p-5 w-1/12">Action</th>
                </tr>
              </thead>
              <tbody>
                {!!kampus?.length &&
                  kampus.map((kampus: any, i: any) => (
                    <tr
                      key={i}
                      className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                    >
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {i + 1}
                      </td>
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {kampus?.id}
                      </td>
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {kampus?.name}
                      </td>
                      <td className="flex text-center w-fit px-2 py-2 lg:px-5 lg:py-3.5 whitespace-pre-line">
                        <EditUnit prop="kampus" data={kampus} />
                        <DeleteItem prop="kampus" data={kampus} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* UNIT */}
      <div className="mb-16">
        <div className="flex justify-between mb-5">
          <div className="text-2xl font-bold">Unit</div>
          <AddUnit prop="unit" />
        </div>
        <div className="bg-white">
          <div className="max-w-full overflow-x-auto">
            <table className="  w-full">
              <thead className=" bg-gray-900 text-gray-50">
                <tr>
                  <th className="px-2 py-3 lg:p-5 w-1/12">No</th>
                  <th className="px-2 py-3 lg:p-5 w-1/12">id</th>
                  <th className="px-2 py-3 lg:p-5 w-full">Name</th>
                  <th className="px-2 py-3 lg:p-5 w-1/12">Action</th>
                </tr>
              </thead>
              <tbody>
                {!!unit?.length &&
                  unit.map((unit: any, i: any) => (
                    <tr
                      key={i}
                      className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                    >
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {i + 1}
                      </td>
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {unit?.id}
                      </td>
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {unit?.name}
                      </td>
                      <td className="flex text-center px-2 py-2 lg:px-5 lg:py-3.5 whitespace-pre-line ">
                        <EditUnit prop="unit" data={unit} />
                        <DeleteItem prop="unit" data={unit} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* SUB-UNIT */}
      <div>
        <div className="flex justify-between mb-5">
          <div className="text-2xl font-bold">Sub-Unit</div>
          <AddUnit prop="subunit" />
        </div>
        <div className="bg-white">
          <div className="max-w-full overflow-x-auto">
            <table className="  w-full">
              <thead className=" bg-gray-900 text-gray-50">
                <tr>
                  <th className="px-2 py-3 lg:p-5 w-1/12">No</th>
                  <th className="px-2 py-3 lg:p-5 w-1/12">id</th>
                  <th className="px-2 py-3 lg:p-5 w-1/12">Jabatan</th>
                  <th className="px-2 py-3 lg:p-5 w-full">Name</th>
                  <th className="px-2 py-3 lg:p-5 w-1/12">Action</th>
                </tr>
              </thead>
              <tbody>
                {!!subunit?.length &&
                  subunit.map((subunit: any, i: any) => (
                    <tr
                      key={i}
                      className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                    >
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {i + 1}
                      </td>
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {subunit?.id}
                      </td>
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {subunit?.position.charAt(0) +
                          subunit?.position.slice(1).toLowerCase()}
                      </td>
                      <td className="px-2 py-2 lg:px-5 lg:py-3.5 text-base whitespace-pre-line">
                        {subunit?.name}
                      </td>
                      <td className="flex text-center px-2 py-2 lg:px-5 lg:py-3.5 whitespace-pre-line ">
                        <EditUnit prop="subunit" data={subunit} />
                        <DeleteItem prop="subunit" data={subunit} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
