'use client'
import React from 'react'
import EditModal from '~/app/(authenticated)/components/editModal'
import FloatInput from '~/components/floatInput'
import { usePatch } from '~/services/dashboard'

export default function EditElfSight({ data, category }: any) {
  const { mutateAsync: editElfsight } = usePatch('elfsight')

  const handleSubmit = async (e: any) => {
    try {
      const payload: any = {
        class: e.target.class.value,
        category: e.target.category.value,

        active: true,
      }

      await editElfsight({ id: data.id, payload })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <EditModal
      data={data}
      title="Edit Frame"
      handleSubmit={handleSubmit}
      showImage={false}
    >
      <FloatInput name="class" label="Class" defaultValue={data.class} />
      <FloatInput
        name="category"
        label="Category"
        defaultValue={data.category}
        disabled
        className="disabled:cursor-not-allowed"
      />

      {/* <div className="flex justify-between py-5">
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
                `${e.target.checked ? "ACTIVATE" : "UNACTIVATE"} this comment?`
              );
              if (!confirmed) {
                e.target.checked = !e.target.checked;
              }
            }}
          />
        </div>
      </div> */}
    </EditModal>
  )
}
