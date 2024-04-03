'use client'
import React, { useState } from 'react'
import TextEditor from '~/components/Editor'
import EditModal from '~/app/(authenticated)/components/editModal'
import { usePatch, usePost } from '~/services/dashboard'
import FloatInput from '~/components/floatInput'

export default function EditContentModal({ children, data }: any) {
  const { mutateAsync: patchContent } = usePatch('content')
  const { mutateAsync: upload }: any = usePost('upload')
  const [isRemove, setIsRemove]: any = useState(false)

  const [dataText, setDataText]: any = useState('')

  const handleSubmit = async (e: any) => {
    try {
      const payload: any = {
        title: dataText?.title ?? data?.title,
        sub: dataText?.sub ?? data?.sub,
        description: dataText?.description ?? data?.description,
        active: e.target.active.checked,
      }
      const imageInput = e.target.querySelector('input.current')
      if (imageInput && imageInput?.files?.length) {
        const formData = new FormData()
        formData.append('file', imageInput.files[0])
        if (data.image) {
          formData.append('oldFile', data.image)
        }

        const { image } = await upload(formData)
        payload.image = image
      }

      if (isRemove) {
        payload.image = null
        payload.deletedImage = data.image
        setIsRemove(false)
      }
      await patchContent({
        id: data.id,
        payload,
      })
    } catch (error) {
      console.log(error)
    }
  }
  const isHomeCover = data.page == 'home' && data.section == 'cover'
  const isHomeThird = data.page == 'home' && data.section == 'third_bottom'
  const isCarrerSixth = data.page == 'careers' && data.section == 'sixth'
  const isAboutUsCover = data.page == 'about us' && data.section == 'cover'
  const isFooter = data.page == 'footer' && data.section == 'footer'
  return (
    <EditModal
      data={data}
      title="Edit Content"
      showImage={!!data.image}
      handleSubmit={handleSubmit}
      removeProps={[isRemove, setIsRemove]}
    >
      {isHomeCover ||
      isHomeThird ||
      isCarrerSixth ||
      isAboutUsCover ||
      isFooter ? (
        <>
          <TextEditor
            textarea
            id="title"
            label="Title:"
            defaultValue={data?.title}
            name="title"
            onBlur={(e: any) => {
              setDataText((prevDataText: any) => ({
                ...prevDataText,
                title: e.target.getContent(),
              }))
            }}
          />
          <TextEditor
            textarea
            id="description"
            label="Description:"
            defaultValue={data?.description || ''}
            name="description"
            onBlur={(e: any) => {
              setDataText((prevDataText: any) => ({
                ...prevDataText,
                description: e.target.getContent(),
              }))
            }}
          />
        </>
      ) : (
        <>
          <FloatInput
            id="title"
            label="Title:"
            defaultValue={data?.title}
            name="title"
            onChange={(e: any) => {
              setDataText((prevDataText: any) => ({
                ...prevDataText,
                title: e.target.value,
              }))
            }}
          />
          <FloatInput
            textarea
            id="description"
            label="Description:"
            defaultValue={data?.description || ''}
            name="description"
            onChange={(e: any) => {
              setDataText((prevDataText: any) => ({
                ...prevDataText,
                description: e.target.value,
              }))
            }}
          />
        </>
      )}

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
                `${e.target.checked ? 'ACTIVATE' : 'UNACTIVATE'} this content?`,
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
