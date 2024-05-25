'use client'
import React from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePatch } from '~/services/dashboard'

export default function Edit({ data, prop }: any) {
  const { mutateAsync: edit } = usePatch(prop)

  const handleSubmit = async (e: any) => {
    try {
      const payload: any = {
        name: e.target.name.value,
      }
      await edit({ id: data.id, payload })
    } catch (error) {
      console.log(error)
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
    </EditModal>
  )
}
