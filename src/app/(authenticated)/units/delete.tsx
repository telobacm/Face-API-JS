'use client'
import React from 'react'
import { useDelete, usePatch } from '~/services/dashboard'
import AreYouSure from '../components/confirmDelete'

export default function Delete({ data, prop }: any) {
  const { mutateAsync: deleteItem }: any = useDelete(prop)

  const handleSubmit = async (e: any) => {
    try {
      await deleteItem(data.id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AreYouSure
      data={data}
      title={`Hapus ${prop.charAt(0).toUpperCase() + prop.slice(1)}`}
      prop={prop}
      showImage={false}
      handleSubmit={handleSubmit}
    ></AreYouSure>
  )
}
