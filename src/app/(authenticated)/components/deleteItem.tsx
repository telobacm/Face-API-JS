'use client'
import React from 'react'
import { useDelete, usePatch } from '~/services/dashboard'
import ConfirmDeleteModal from './confirmDeleteModal'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function DeleteItem({ data, prop }: any) {
  const router = useRouter()
  const { mutateAsync: deleteItem }: any = useDelete(prop)
  const { mutateAsync: edit } = usePatch('users')

  const handleSubmit = async (e: any) => {
    if (prop === 'users') {
      try {
        const payload: any = {
          isDeleted: true,
        }

        const res = await edit({ id: data?.id, payload })
        if (res?.error == null) {
          toast.success('Hapus User berhasil !')
          sessionStorage.setItem('toastMessage', 'Hapus User berhasil !')
          router.push('/users')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await deleteItem(data.id)
        toast.success(
          `${prop === 'devices' ? 'Perangkat' : prop.charAt(0).toUpperCase() + prop.slice(1)} berhasil dihapus`,
        )
        // SEMENTARA MASIH GAGAL invalidateQueries /devices
        {
          prop == 'devices' &&
            toast.info('Silakan refresh jika perubahan terkait perangkat anda')
        }
      } catch (error: any) {
        toast.error(
          `Gagal menghapus ${prop === 'devices' ? 'Perangkat' : prop.charAt(0).toUpperCase() + prop.slice(1)}`,
        )
        console.log(error)
      }
    }
  }

  return (
    <ConfirmDeleteModal
      data={data}
      title={`Hapus ${prop == 'devices' ? 'Perangkat' : prop === 'users' ? 'User' : prop.charAt(0).toUpperCase() + prop.slice(1)}`}
      prop={prop}
      showImage={false}
      handleSubmit={handleSubmit}
    ></ConfirmDeleteModal>
  )
}
