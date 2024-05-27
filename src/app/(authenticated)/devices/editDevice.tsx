'use client'
import React from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import Loading from '~/components/loading'
import { useGetList, usePatch } from '~/services/dashboard'

export default function EditDevice({ data, prop }: any) {
  const { data: kampus, isLoading: isLoadingKampus } = useGetList('kampus')
  const { data: units, isLoading: isLoadingUnits } = useGetList('unit')
  const { mutateAsync: edit } = usePatch(prop)
  console.log('data device', data)
  console.log('id device', data.id)

  const handleSubmit = async (e: any) => {
    try {
      const { mac, kampus, unit } = e.target

      const payload: any = {
        mac: mac.value,
        kampus: { connect: { id: parseInt(kampus.value) } },
        unit: { connect: { id: parseInt(unit.value) } },
      }
      await edit({ id: data.id, payload })
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
      data={data}
      title={`Edit ${prop.charAt(0).toUpperCase() + prop.slice(1)}`}
      showImage={false}
      handleSubmit={handleSubmit}
    >
      <FloatInput name="mac" label="Mac Address" defaultValue={data.mac} />
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
