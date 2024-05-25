'use client'
import React from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePost } from '~/services/dashboard'

export default function Add({ prop }: any) {
  const { mutateAsync: add }: any = usePost(prop)

  const handleSubmit = async (e: any) => {
    try {
      const { name } = e.target

      const payload = {
        name: name.value,
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
    </EditModal>
  )
}
