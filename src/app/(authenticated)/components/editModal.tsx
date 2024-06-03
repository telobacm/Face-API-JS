'use client'
import * as Dialog from '@radix-ui/react-dialog'
import React, { useCallback, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiAddToQueue, BiPencil, BiSolidUserDetail } from 'react-icons/bi'
import UploadImage from '~/components/uploadImage'

export default function EditModal({
  title,
  requiredImage,
  children,
  data,
  showImage = true,
  longImage,
  doubleImage,
  removeProps = [false, () => {}],
  removeProps2 = [false, () => {}],
  isAdd,
  defaultAdd = false,
  detail = '',
  className = '',
  handleSubmit = (e: any) => e.preventDefault(),
}: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const closeModalAndResetIsRemove = useCallback(() => {
    setIsDialogOpen(false)
    removeProps[1](false)
    removeProps2[1](false)
  }, [removeProps, removeProps2, setIsDialogOpen])

  const submit = (e: any) => {
    e.preventDefault()
    closeModalAndResetIsRemove()
    handleSubmit(e)
  }
  const [isRemove, setIsRemove]: any = useState(null)
  const [isRemove2, setIsRemove2]: any = useState(null)
  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <div className={`${defaultAdd ? '' : 'px-1'} ${isAdd ? '' : 'm-auto'}`}>
          {isAdd ? (
            <button
              className={`capitalize flex gap-3 items-center bg-primary hover:bg-blue-600 text-white font-bold w-min py-2 px-5 rounded-xl whitespace-nowrap ${className}`}
            >
              <BiAddToQueue />
              Add {detail}
            </button>
          ) : (
            // : isUser ? (
            //   <button className="text-lg mx-auto inline-flex justify-center w-fit p-2.5 -m-2 rounded-lg hover:bg-yellow-300 text-black hover:font-bold hover:text-gray-700">
            //     <BiSolidUserDetail />
            //   </button>
            // )
            <button className="text-lg mx-auto inline-flex justify-center w-fit p-2.5 -m-2 rounded-lg hover:bg-yellow-300 text-black hover:font-bold hover:text-gray-700">
              <BiPencil />
            </button>
          )}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[50] bg-primary bg-opacity-40 " />
        <Dialog.Content className="data-[state=open]:animate-contentShow overflow-y-auto absolute   z-[50] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  focus:outline-none bg-white border border-primary rounded-xl w-min  p-5 shadow-2xl drop-shadow-2xl !max-h-[95vh] !overflow-auto">
          <div className="w-full flex justify-end">
            <button
              onClick={closeModalAndResetIsRemove}
              className=" -mt-2 -mr-2"
            >
              <AiOutlineClose />
            </button>
          </div>
          <Dialog.Title className="capitalize font-bold text-xl">
            {title}
          </Dialog.Title>
          <form
            onSubmit={submit}
            className=" w-full min-w-[80vw] lg:min-w-[40rem] space-y-3 mt-5"
          >
            {children}
            {showImage && (
              <UploadImage
                data={data}
                longImage={longImage}
                isAdd={isAdd}
                doubleImage={doubleImage}
                removeProps={removeProps || [isRemove, setIsRemove]}
                removeProps2={removeProps2 || [isRemove2, setIsRemove2]}
                requiredImage={requiredImage}
              />
            )}
            <div className={`mt-7 flex justify-end gap-3`}>
              <button
                onClick={closeModalAndResetIsRemove}
                type="button"
                className="bg-red-700 text-white px-5 py-2 rounded-xl"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-5 py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
