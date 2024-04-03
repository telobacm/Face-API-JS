'use client'
import React, { useState } from 'react'
import TextEditor from '~/components/Editor'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePatch, usePost } from '~/services/dashboard'

export default function EditComment({ data, category }: any) {
  const { mutateAsync: editComment } = usePatch('comment')
  const { mutateAsync: upload }: any = usePost('upload')
  const [dataText, setDataText]: any = useState('')
  const [isRemove, setIsRemove]: any = useState(false)

  const handleSubmit = async (e: any) => {
    try {
      const payload: any = {
        name: e.target.name.value,
        position: e.target.position.value,
        periode: e.target.periode.value,
        content: dataText?.content ?? data?.content,

        active: e.target.active.checked,
      }

      const imageInput = e.target.querySelector('input.current')
      const isDeleting = !imageInput?.files?.length && data.photo

      if (imageInput && imageInput?.files?.length) {
        const formData = new FormData()
        formData.append('file', imageInput.files[0])
        if (data.photo) {
          formData.append('oldFile', data.photo)
        }

        const { image } = await upload(formData)
        payload.photo = image
      }
      if (isRemove) {
        payload.photo = null
        payload.deletedImage = data.photo
        setIsRemove(false)
      }

      await editComment({ id: data.id, payload })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <EditModal
      data={{ image: data.photo, ...data }}
      title="Edit Comment"
      handleSubmit={handleSubmit}
      removeProps={[isRemove, setIsRemove]}
    >
      <FloatInput name="name" label="Name" defaultValue={data.name} />
      <FloatInput
        name="position"
        label="Position"
        defaultValue={data.position}
      />
      <FloatInput name="periode" label="Periode" defaultValue={data.periode} />
      <TextEditor
        id="content"
        label="Content:"
        defaultValue={data?.content}
        name="content"
        onBlur={(e: any) => {
          setDataText((prevDataText: any) => ({
            ...prevDataText,
            content: e.target.getContent(),
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
                `${e.target.checked ? 'ACTIVATE' : 'UNACTIVATE'} this comment?`,
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
