'use client'
import React, { useState } from 'react'
import TextEditor from '~/components/Editor'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePost } from '~/services/dashboard'

export default function AddTeam({ category }: any) {
  const { mutateAsync: addTeam }: any = usePost('team')
  const { mutateAsync: upload }: any = usePost('upload')
  const [dataText, setDataText]: any = useState('')

  const handleSubmit = async (e: any) => {
    try {
      const { name, active, position, education } = e.target
      let advisorData = category == 'advisor' ? true : false
      const payload: any = {
        name: name.value,
        position: position.value,
        // education: education.value,
        education: dataText?.education ?? '',

        active: active.checked,
        advisor: advisorData,
      }

      const uploadFile = async (inputName: string, payloadKey: string) => {
        const input = e.target.querySelector(`input.${inputName}`)
        if (input && input.files.length > 0) {
          const formData = new FormData()
          formData.append('file', input.files[0])
          const { image } = await upload(formData)
          payload[payloadKey] = image
        }
      }

      await uploadFile('current', 'photo')
      await uploadFile('double', 'avatar')

      addTeam(payload)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <EditModal
      title={`Add ${category}`}
      isAdd
      doubleImage
      detail={category}
      handleSubmit={handleSubmit}
    >
      <FloatInput name="name" label="Name" />
      <FloatInput name="position" label="Position" />
      <FloatInput
        textarea
        id="education"
        name="education"
        label="Education:"
        onChange={(e: any) => {
          setDataText((prevDataText: any) => ({
            ...prevDataText,
            education: e.target.value,
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
