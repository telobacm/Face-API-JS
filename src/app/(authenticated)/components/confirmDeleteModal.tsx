'use client'
import * as Dialog from '@radix-ui/react-dialog'
import React, { useCallback, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiTrash } from 'react-icons/bi'

export default function ConfirmDeleteModal({
  title,
  children,
  data,
  prop,
  detail = '',
  className = '',
  handleSubmit = (e: any) => e.preventDefault(),
}: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const closeModal = useCallback(() => {
    setIsDialogOpen(false)
  }, [setIsDialogOpen])

  const submit = (e: any) => {
    e.preventDefault()
    closeModal()
    handleSubmit(e)
  }
  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <div className="px-1">
          {prop === 'users' ? (
            <button
              disabled={data?.role === 'SUPERADMIN'}
              className="mt-3 bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl"
            >
              Delete User
            </button>
          ) : (
            <button
              className={`text-lg mx-auto inline-flex justify-center  w-fit p-2.5 -m-2 rounded-lg hover:bg-red-500 text-black hover:text-gray-300`}
            >
              <BiTrash />
            </button>
          )}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[50] bg-primary bg-opacity-40 " />
        <Dialog.Content className="data-[state=open]:animate-contentShow overflow-y-auto absolute   z-[50] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  focus:outline-none bg-white border border-primary rounded-xl w-min  p-5 shadow-2xl drop-shadow-2xl !max-h-[95vh] !overflow-auto">
          <div className="w-full flex justify-end">
            <button onClick={closeModal} className=" -mt-2 -mr-2">
              <AiOutlineClose />
            </button>
          </div>
          <Dialog.Title className="capitalize font-bold text-xl">
            {title}
          </Dialog.Title>
          <Dialog.Description className="font-normal text-lg mt-6">
            Anda yakin untuk menghapus{' '}
            {prop === 'devices'
              ? 'mac address'
              : prop === 'users'
                ? 'User'
                : prop.charAt(0).toUpperCase() + prop.slice(1)}{' '}
            <span className="font-semibold">
              {prop === 'devices' ? data?.mac : data?.name}
            </span>{' '}
            ?
          </Dialog.Description>
          <form
            onSubmit={submit}
            className=" w-full min-w-[80vw] lg:min-w-[40rem] space-y-3 mt-5"
          >
            {children}
            <div className={`mt-7 flex justify-end gap-3`}>
              <button
                type="submit"
                className="bg-red-700 text-white px-5 py-2 rounded-xl"
              >
                Delete
              </button>
              <button
                onClick={closeModal}
                type="button"
                className="bg-primary text-white px-5 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
