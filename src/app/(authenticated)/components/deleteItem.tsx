'use client'
import React from 'react'
import { useDelete } from '~/services/dashboard'
import ConfirmDeleteModal from './confirmDeleteModal'
import { toast } from 'react-toastify'

export default function DeleteItem({ data, prop }: any) {
  const { mutateAsync: deleteItem }: any = useDelete(prop)

  const handleSubmit = async (e: any) => {
    try {
      await deleteItem(data.id)
      toast.success(
        `${prop == 'devices' ? 'Perangkat' : prop.charAt(0).toUpperCase() + prop.slice(1)} berhasil dihapus`,
      )
      // SEMENTARA MASIH GAGAL invalidateQueries /devices
      {
        prop == 'devices' &&
          toast.info('Silakan refresh jika perubahan terkait perangkat anda')
      }
    } catch (error: any) {
      toast.error(
        `Gagal menghapus ${prop == 'devices' ? 'Perangkat' : prop.charAt(0).toUpperCase() + prop.slice(1)}`,
      )
      console.log(error)
    }
  }

  return (
    <ConfirmDeleteModal
      data={data}
      title={`Hapus ${prop == 'devices' ? 'Perangkat' : prop.charAt(0).toUpperCase() + prop.slice(1)}`}
      prop={prop}
      showImage={false}
      handleSubmit={handleSubmit}
    ></ConfirmDeleteModal>
  )
}
