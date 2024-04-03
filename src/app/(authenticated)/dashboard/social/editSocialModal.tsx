'use client'
import React from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePatch, usePost } from '~/services/dashboard'

export default function EditSocialModal({ children, data }: any) {
  const { mutateAsync: patchContent } = usePatch('social')

  const handleSubmit = async (e: any) => {
    try {
      const { link, location, category, tag, active } = e.target
      const payload = {
        link: link?.value,
        location: location?.value,
        category: category?.value,
        tag: tag?.value,
        active: active.checked,
      }

      patchContent({
        id: data.id,
        payload,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <EditModal
      data={data}
      showImage={false}
      title="Edit Social"
      handleSubmit={handleSubmit}
    >
      <FloatInput
        name="link"
        label="Link"
        type="link"
        defaultValue={data.link}
      />
      <FloatInput
        name="location"
        label="Location"
        defaultValue={data.location}
      />
      <FloatInput
        name="category"
        label="Category"
        defaultValue={data.category}
      />
      <FloatInput name="tag" label="Tag" defaultValue={data.tag} />
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
                `${e.target.checked ? 'ACTIVATE' : 'UNACTIVATE'} this social?`,
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
