'use client'
import React, { useState } from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import TextEditor from '~/components/Editor'
import FloatInput from '~/components/floatInput'
import { usePatch, usePost } from '~/services/dashboard'

export default function EditTeam({ data, category }: any) {
  const { mutateAsync: editTeam } = usePatch('team')
  const { mutateAsync: upload }: any = usePost('upload')
  const [dataText, setDataText]: any = useState('')
  const [isRemove, setIsRemove]: any = useState(false)
  const [isRemove2, setIsRemove2]: any = useState(false)

  const handleSubmit = async (e: any) => {
    try {
      const payload: any = {
        name: e.target.name.value,
        position: e.target.position.value,
        education: dataText?.education ?? data?.education,

        active: e.target.active.checked,
      }

      const imageInput = e.target.querySelector('input.current')
      const imageInput2 = e.target.querySelector('input.double')
      if (imageInput && imageInput?.files?.length) {
        const formData = new FormData()
        formData.append('file', imageInput.files[0])
        if (data.photo) {
          formData.append('oldFile', data.photo)
        }
        const { image } = await upload(formData)
        payload.photo = image
      }
      if (imageInput2 && imageInput2?.files?.length) {
        const formData = new FormData()
        formData.append('file', imageInput2.files[0])
        if (data.avatar) {
          formData.append('oldFile', data.avatar)
        }
        const { image } = await upload(formData)
        payload.avatar = image
      }
      if (isRemove) {
        payload.photo = null
        payload.deletedImage = data.photo
        setIsRemove(false)
      }
      if (isRemove2) {
        payload.avatar = null
        payload.deletedImage2 = data.avatar
        setIsRemove2(false)
      }

      await editTeam({ id: data.id, payload })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <EditModal
      data={{ image: data.photo, ...data }}
      doubleImage
      removeProps={[isRemove, setIsRemove]}
      removeProps2={[isRemove2, setIsRemove2]}
      title={`Edit ${category}`}
      handleSubmit={handleSubmit}
    >
      <FloatInput name="name" label="Name" defaultValue={data.name} />
      <FloatInput
        name="position"
        label="Position"
        defaultValue={data.position}
      />
      <TextEditor
        textarea
        id="education"
        label="Education:"
        defaultValue={data?.education}
        name="education"
        onBlur={(e: any) => {
          setDataText((prevDataText: any) => ({
            ...prevDataText,
            education: e.target.getContent(),
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
