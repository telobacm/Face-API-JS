'use client'
import React, { useState } from 'react'
import { BiCloudUpload, BiPencil, BiTrashAlt } from 'react-icons/bi'

export default function UploadImage({
  requiredImage,
  data,
  isAdd = false,
  longImage,
  removeProps,
  removeProps2,
  doubleImage,

  isMedia = false,
}: any) {
  const [selectedImage, setSelectedImage]: any = useState(null)
  const [selectedImage2, setSelectedImage2]: any = useState(null)
  const [isRemove, setIsRemove]: any = removeProps
  const [isRemove2, setIsRemove2]: any = removeProps2

  const [selectedInput, setSelectedInput] = useState(isAdd ? 'add' : 'edit')
  const [selectedInput2, setSelectedInput2] = useState(isAdd ? 'add' : 'edit')

  const handleImageChange = (
    event: any,
    type: any,
    setter: any,
    isPrimary: any,
  ) => {
    const file = event.target.files[0]
    if (file) {
      if (isPrimary == 'primary') {
        setSelectedInput(type)
        setter(file)
        if (isRemove !== null) {
          setIsRemove(false)
        }
      } else {
        setSelectedInput2(type)
        if (isRemove2 !== null) {
          setIsRemove2(false)
        }
        setter(file)
      }
    }
  }
  const handleRemove = (event: any, isPrimary: string) => {
    event.stopPropagation()
    if (isPrimary == 'primary') {
      if (isRemove !== null) {
        setIsRemove(true)
      }
      setSelectedImage(null)
    } else {
      if (isRemove2 !== null) {
        setIsRemove2(true)
      }
      setSelectedImage2(null)
    }
  }
  const nocache = '?timestamp=' + new Date().getTime()

  return (
    <div className="flex gap-4 md:gap-10">
      <div className="space-y-3">
        <div>Image:</div>
        {(!data?.image || isRemove || selectedInput === 'add') && (
          <div className="relative">
            <input
              id="addImage"
              // required={isMedia && selectedInput === 'add'}
              required={requiredImage}
              type="file"
              accept="image/*,video/mp4,video/webm,video/*"
              name={isAdd ? 'image' : ''}
              onChange={(e) =>
                handleImageChange(e, 'add', setSelectedImage, 'primary')
              }
              className={`${
                selectedInput === 'add' ? 'current' : ''
              } absolute top-0 left-0 m-0 ${
                longImage ? 'w-56' : 'w-36'
              } h-36 cursor-pointer p-0 opacity-0 outline-none`}
            />
            {(!selectedImage || isRemove) && (
              <div
                id="addImage"
                className={`mb-5.5 block ${
                  longImage ? 'w-56' : 'w-36'
                } h-36 cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5`}
              >
                <div className="flex flex-col items-center justify-center space-y-3 w-full h-full">
                  <BiCloudUpload className="text-4xl" />
                  <span className="text-primary">Upload</span>
                </div>
              </div>
            )}
          </div>
        )}
        {(data?.image || selectedImage) && !isRemove && (
          <div className={`relative ${longImage ? 'w-56' : 'w-36'} h-36`}>
            {data?.image?.includes('.webm') ||
            (data?.image?.includes('.mp4') && !selectedImage) ? (
              <video className="w-full h-auto" muted loop autoPlay playsInline>
                <source
                  src={`/videos/${data?.image}` + nocache}
                  type="video/mp4"
                />
                <source
                  src={`/videos/${data?.image}` + nocache}
                  type="video/webm"
                />
              </video>
            ) : (
              <div>
                {(selectedImage && selectedImage?.name?.includes('.webm')) ||
                selectedImage?.name?.includes('.mp4') ? (
                  <video
                    className="w-full h-auto"
                    muted
                    loop
                    autoPlay
                    playsInline
                  >
                    <source
                      src={URL.createObjectURL(selectedImage)}
                      type="video/webm"
                    />
                    <source
                      src={URL.createObjectURL(selectedImage)}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : `${
                            data?.image?.includes('.gif')
                              ? '/videos/'
                              : '/images/'
                          }${data.image}` + nocache
                    }
                    className={'h-36 w-full bg-transparent object-fill'}
                    alt=""
                  />
                )}
              </div>
            )}
            <div className="absolute top-0 w-full flex justify-end items-center gap-2">
              <div>
                <label
                  htmlFor="EditImage"
                  className="cursor-pointer flex items-center justify-center bg-blue-500 hover:bg-blue-700 w-7 h-7 rounded-full"
                >
                  <BiPencil className="text-white" />
                </label>
                <input
                  id="EditImage"
                  name="image"
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/*"
                  onChange={(e) =>
                    handleImageChange(e, 'edit', setSelectedImage, 'primary')
                  }
                  className={`${
                    selectedInput === 'edit' ? 'current' : ''
                  } hidden`}
                />
              </div>
              <div
                onClick={(e) => handleRemove(e, 'primary')}
                className="cursor-pointer flex items-center justify-center bg-red-500 hover:bg-red-700 w-7 h-7 rounded-full"
              >
                <BiTrashAlt className="text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {doubleImage && (
        <div className="space-y-3">
          <div>Avatar:</div>
          {(!data?.avatar || isRemove2 || selectedInput === 'add') && (
            <div className="relative">
              <input
                id="addAvatar"
                type="file"
                accept="image/*,video/mp4,video/webm,video/*"
                name={isAdd ? 'image' : ''}
                onChange={(e) =>
                  handleImageChange(e, 'add', setSelectedImage2, 'secondary')
                }
                className={`${
                  selectedInput2 === 'add' ? 'double' : ''
                } absolute top-0 left-0 m-0 ${
                  longImage ? 'w-56' : 'w-36'
                } h-36 cursor-pointer p-0 opacity-0 outline-none`}
              />
              {(!selectedImage2 || isRemove2) && (
                <div
                  id="addAvatar"
                  className={`mb-5.5 block ${
                    longImage ? 'w-56' : 'w-36'
                  } h-36 cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5`}
                >
                  <div className="flex flex-col items-center justify-center space-y-3 w-full h-full">
                    <BiCloudUpload className="text-4xl" />
                    <span className="text-primary">Upload</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {(data?.avatar || selectedImage2) && !isRemove2 && (
            <div className={`relative ${longImage ? 'w-56' : 'w-36'} h-36`}>
              {data?.avatar?.includes('.webm') ||
              (data?.avatar?.includes('.mp4') && !selectedImage2) ? (
                <video
                  className="w-full h-auto"
                  muted
                  loop
                  autoPlay
                  playsInline
                >
                  <source
                    src={`/videos/${data?.avatar}` + nocache}
                    type="video/webm"
                  />
                  <source
                    src={`/videos/${data?.avatar}` + nocache}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <>
                  {(selectedImage2 &&
                    selectedImage2?.name?.includes('.webm')) ||
                  selectedImage2?.name?.includes('.mp4') ? (
                    <video
                      className="w-full h-auto"
                      muted
                      loop
                      autoPlay
                      playsInline
                    >
                      <source
                        src={URL.createObjectURL(selectedImage2)}
                        type="video/webm"
                      />
                      <source
                        src={URL.createObjectURL(selectedImage2)}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      src={
                        selectedImage2
                          ? URL.createObjectURL(selectedImage2)
                          : `${
                              data?.avatar?.includes('.gif')
                                ? '/videos/'
                                : '/images/'
                            }${data.avatar}` + nocache
                      }
                      className={`${
                        data?.avatar?.includes('.svg')
                          ? 'bg-primary'
                          : 'bg-transparent'
                      } w-full h-full object-fill`}
                      alt=""
                    />
                  )}
                </>
              )}
              <div className="absolute top-0 w-full flex justify-end items-center gap-2">
                <div>
                  <label
                    htmlFor="EditImage"
                    className="cursor-pointer flex items-center justify-center bg-blue-500 hover:bg-blue-700 w-7 h-7 rounded-full"
                  >
                    <BiPencil className="text-white" />
                  </label>
                  <input
                    id="EditImage"
                    name="image"
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/*"
                    onChange={(e) =>
                      handleImageChange(
                        e,
                        'edit',
                        setSelectedImage2,
                        'secondary',
                      )
                    }
                    className={`${
                      selectedInput2 === 'edit' ? 'double' : ''
                    } hidden`}
                  />
                </div>
                <div
                  onClick={(e) => handleRemove(e, 'secondary')}
                  className="cursor-pointer flex items-center justify-center bg-red-500 hover:bg-red-700 w-7 h-7 rounded-full"
                >
                  <BiTrashAlt className="text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
// success upload
