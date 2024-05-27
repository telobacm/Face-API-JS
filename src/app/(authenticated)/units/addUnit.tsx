'use client'
import React from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePost } from '~/services/dashboard'

export default function AddUnit({ prop }: any) {
  const { mutateAsync: add }: any = usePost(prop)

  const handleSubmit = async (e: any) => {
    try {
      const { name, position } = e.target

      const payload: any = {
        name: name.value,
      }
      if (prop === 'subunit') {
        payload.position = position.value
      }
      add(payload)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <EditModal
      title={`Add ${prop.charAt(0).toUpperCase() + prop.slice(1)}`}
      isAdd
      defaultAdd={true}
      detail={prop.charAt(0).toUpperCase() + prop.slice(1)}
      showImage={false}
      handleSubmit={handleSubmit}
    >
      <FloatInput name="name" label="Name" />
      {prop === 'subunit' && (
        <select
          required
          name="position"
          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        >
          <option value="" disabled selected hidden className="text-gray-400">
            Pilih Jabatan
          </option>
          <option value="DOSEN"> Dosen </option>
          <option value="STAFF"> Staff </option>
        </select>
      )}
    </EditModal>
  )
}
