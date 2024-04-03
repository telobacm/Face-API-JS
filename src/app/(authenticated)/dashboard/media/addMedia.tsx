'use client'
import React, { useState } from 'react'
import TextEditor from '~/components/Editor'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePost } from '~/services/dashboard'

export default function AddMedia({ category }: any) {
  const { mutateAsync: addMedia }: any = usePost('media')
  const { mutateAsync: upload }: any = usePost('upload')
  const [dataText, setDataText]: any = useState('')

  const handleSubmit = async (e: any) => {
    try {
      const { link, active } = e.target
      const imageInput = e.target.querySelector('input.current')

      const payload = {
        category: category,
        link: link.value,
        description: dataText?.description ?? '',

        active: active.checked,
        name: '',
      }

      if (imageInput && imageInput.files.length > 0) {
        const formData = new FormData()
        formData.append('file', imageInput.files[0])
        const { image } = await upload(formData)
        payload.name = image
      }

      await addMedia(payload)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <EditModal
      requiredImage
      title="Add "
      isAdd
      detail={category}
      longImage
      handleSubmit={handleSubmit}
    >
      <FloatInput name="link" label="Link" type="link" />
      <FloatInput
        textarea
        id="description"
        label="Description:"
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
            defaultChecked={true}
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
