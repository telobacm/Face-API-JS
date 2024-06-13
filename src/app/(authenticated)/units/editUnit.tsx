'use client'
import React from 'react'
import { toast } from 'react-toastify'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePatch } from '~/services/dashboard'

export default function EditUnit({ data, prop }: any) {
  const { mutateAsync: edit } = usePatch(prop)

  const handleSubmit = async (e: any) => {
    try {
      const { name, position } = e.target

      const payload: any = {
        name: name.value,
      }
      if (prop === 'subunit') {
        payload.position = position.value
      }
      const res = await edit({ id: data.id, payload })
      if (res.id) {
        toast.success(`${prop} ${res.name} berhasil diedit`)
      }
    } catch (error) {
      console.log(error)
      toast.error(`Gagal mengedit ${prop}`)
    }
  }
  return (
    <EditModal
      data={data}
      title={`Edit ${prop.charAt(0).toUpperCase() + prop.slice(1)}`}
      showImage={false}
      handleSubmit={handleSubmit}
    >
      <FloatInput name="name" label="Name" defaultValue={data.name} />
      {prop === 'subunit' && (
        <div>
          <label className="mb-1 mt-3 block font-medium text-black text-sm">
            Jabatan
          </label>
          <div className="relative">
            <select
              required
              name="position"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              defaultValue={data.position}
            >
              <option
                value=""
                disabled
                selected
                hidden
                className="text-gray-400"
              >
                Pilih Jabatan
              </option>
              <option value="DOSEN">Dosen</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>
      )}
    </EditModal>
  )
}
