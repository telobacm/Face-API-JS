'use client'
import React, { useState } from 'react'
import TextEditor from '~/components/Editor'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePost } from '~/services/dashboard'

export default function AddComment({ category }: any) {
  const { mutateAsync: addComment }: any = usePost('comment')
  const { mutateAsync: upload }: any = usePost('upload')
  const [dataText, setDataText]: any = useState('')

  const handleSubmit = async (e: any) => {
    try {
      const { name, active, position, periode, content } = e.target
      const imageInput = e.target.querySelector('input.current')

      const payload = {
        category: category,
        name: name.value,
        position: position.value,
        periode: periode.value,
        content: dataText?.content ?? '',

        photo: '',

        active: active.checked,
      }

      if (imageInput && imageInput.files.length > 0) {
        const formData = new FormData()
        formData.append('file', imageInput.files[0])

        const { image } = await upload(formData)
        payload.photo = image
      }

      if (imageInput && imageInput.files.length > 0) {
        const formData = new FormData()
        formData.append('file', imageInput.files[0])

        const { image } = await upload(formData)
        payload.photo = image
      }

      addComment(payload)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <EditModal
      title="Add Comment"
      isAdd
      defaultAdd={true}
      detail="Comment"
      longImage
      handleSubmit={handleSubmit}
    >
      <FloatInput name="name" label="Name" />
      <FloatInput name="position" label="Position" />
      <FloatInput name="periode" label="Periode" />
      <TextEditor
        id="content"
        name="content"
        label="Content:"
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
            defaultChecked={true}
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
