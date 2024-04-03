'use client'
import React, { useState } from 'react'
import TextEditor from '~/components/Editor'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePatch, usePost } from '~/services/dashboard'
import { getFileName } from '~/helpers/utils'

export default function EditMedia({ editMedia, upload, data, category }: any) {
  // const { mutateAsync: editMedia } = usePatch('media')
  // const { mutateAsync: upload }: any = usePost('upload')
  const [dataText, setDataText]: any = useState('')
  const [isRemove, setIsRemove]: any = useState(false)

  const handleSubmit = async (e: any) => {
    try {
      const payload: any = {
        category,
        description: dataText?.description ?? data?.description,

        link: e.target.link.value,
        active: e.target.active.checked,
      }

      const imageInput = e.target.querySelector('input.current')

      const isDeleting = !imageInput?.files?.length && data.name
      if (imageInput && imageInput?.files?.length) {
        const formData = new FormData()
        formData.append('file', imageInput.files[0])
        if (data.name) {
          // const newFileName= getFileName(data.name)
          formData.append('oldFile', data.name)
        }
        const { image } = await upload(formData)

        payload.name = image
      }

      if (isRemove) {
        payload.name = null
        payload.deletedImage = data.name
        setIsRemove(false)
      }

      await editMedia({ id: data.id, payload })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <EditModal
      requiredImage
      data={{ image: data.name, ...data }}
      title="Edit Media"
      longImage
      handleSubmit={handleSubmit}
      removeProps={[isRemove, setIsRemove]}
    >
      <FloatInput
        name="link"
        label="Link"
        type="link"
        defaultValue={data.link}
      />
      <FloatInput
        textarea
        id="description"
        label="Description:"
        defaultValue={data?.description}
        name="description"
        onChange={(e: any) => {
          setDataText((prevDataText: any) => ({
            ...prevDataText,
            description: e.target.value,
          }))
        }}
      />

      <div className="flex justify-between py-5">
        <div className="flex gap-5">
          <label htmlFor="active">Active?:</label>
          <input
            id="active"
            name="active"
            type="checkbox"
            className="w-5 h-5"
            defaultChecked={data.active}
            onChange={(e) => {
              const confirmed = confirm(
                `${e.target.checked ? 'ACTIVATE' : 'UNACTIVATE'} this media?`,
              )
              if (!confirmed) {
                e.target.checked = !e.target.checked
              }
            }}
          />
        </div>
      </div>
    </EditModal>
  )
}
