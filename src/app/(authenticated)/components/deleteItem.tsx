'use client'
import React from 'react'
import { useDelete } from '~/services/dashboard'
import ConfirmDeleteModal from './confirmDeleteModal'

export default function DeleteItem({ data, prop }: any) {
  const { mutateAsync: deleteItem }: any = useDelete(prop)
  console.log('id item', data.id)

  const handleSubmit = async (e: any) => {
    try {
      await deleteItem(data.id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ConfirmDeleteModal
      data={data}
      title={`Hapus ${prop.charAt(0).toUpperCase() + prop.slice(1)}`}
      prop={prop}
      showImage={false}
      handleSubmit={handleSubmit}
    ></ConfirmDeleteModal>
  )
}
