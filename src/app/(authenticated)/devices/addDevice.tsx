'use client'
import React from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import Loading from '~/components/loading'
import { useGetList, usePost } from '~/services/dashboard'

export default function AddDevice({ prop }: any) {
  const { data: kampus, isLoading: isLoadingKampus } = useGetList('kampus')
  const { data: units, isLoading: isLoadingUnits } = useGetList('unit')
  const { mutateAsync: add }: any = usePost(prop)

  const handleSubmit = async (e: any) => {
    try {
      const { mac, kampus, unit } = e.target

      const payload: any = {
        mac: mac.value,
        kampus: { connect: { id: parseInt(kampus.value) } },
        unit: { connect: { id: parseInt(unit.value) } },
      }
      add(payload)
    } catch (error) {
      console.log(error)
    }
  }

  const isLoading = isLoadingKampus && isLoadingUnits
  if (isLoading) {
    return <Loading />
  }
  return (
    <EditModal
      title="Add Device"
      isAdd
      defaultAdd={true}
      detail="Device"
      showImage={false}
      handleSubmit={handleSubmit}
    >
      <FloatInput name="mac" label="Mac Address" />
      <div>
        <label className="mb-1 mt-3 block font-medium text-black">Kampus</label>
        <div className="relative">
          <select
            required
            name="kampus"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="" disabled selected hidden className="text-gray-400">
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
        <label className="mb-1 mt-3 block font-medium text-black">Unit</label>
        <div className="relative">
          <select
            required
            name="unit"
            // onChange={(e) => unitChange(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="" disabled selected hidden className="text-gray-400">
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
    </EditModal>
  )
}
