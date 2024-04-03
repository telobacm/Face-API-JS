'use client'
import React, { useEffect, useState } from 'react'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import CharLimit from '~/components/charLimit'
import EditMedia from './editMedia'
import AddMedia from './addMedia'
import { BiTrashAlt } from 'react-icons/bi'
import { useDelete, useGetList, usePatch, usePost } from '~/services/dashboard'
import { groupByCategory } from '~/helpers/utils'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MediaWrapper from '~/components/media'
import Loading from '~/components/loading'

export default function Page() {
  const { data: media, isFetching, isLoading } = useGetList('media')
  const { mutateAsync: upload, isLoading: isUploading }: any = usePost('upload')
  const { mutateAsync: editMedia, isLoading: isPatching } = usePatch('media')
  const [imageVersion, setimageVersion] = useState(1)

  // const isProcessing = isLoading || isFetching || isUploading
  const isProcessing = isUploading || isPatching

  useEffect(() => {
    !isProcessing && setimageVersion(imageVersion + 1)
  }, [isProcessing])

  const { mutate: delMedia } = useDelete('media')
  const grouped = groupByCategory(media || [])
  function renderComponentBasedOnCategory({ category }: any) {
    if (category == 'investor' || category == 'slides') {
      return <AddMedia category={category} />
    } else {
      return null
    }
  }
  const router = useRouter()
  const { status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  return (
    status == 'authenticated' && (
      <AdminLayout>
        <div className="space-y-10 w-full">
          {!!grouped?.length &&
            grouped.map((category, idx) => (
              <div key={idx} className="bg-white">
                <div className="flex justify-between items-center">
                  <div className="m-0 text-xl font-extrabold uppercase p-7 text-secondary">
                    {` ${category.category} `}
                  </div>
                  {renderComponentBasedOnCategory(category)}
                </div>
                <div className="max-w-full overflow-x-auto">
                  <table className="  w-full">
                    <thead className=" bg-gray-200">
                      <tr>
                        <th className="px-2 py-3 lg:p-5">Link</th>
                        <th className="p-2 w-20">Image</th>

                        <th className="px-2 py-3 lg:p-5 w-10">Active</th>
                        <th className="px-2 py-3 lg:p-5 w-14">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((media: any, i: any) => (
                        <tr key={i} className=" border-b">
                          <td className="p-2 lg:p-5 text-xs lg:text-base whitespace-pre-line">
                            <a
                              href={media.link}
                              target="_blank"
                              className="whitespace-pre-line hover:text-blue-300"
                            >
                              <CharLimit
                                className="hidden lg:block"
                                text={media.link}
                              />
                              <CharLimit
                                className="lg:hidden"
                                text={media.link}
                                max={50}
                              />
                            </a>
                          </td>
                          <td className="py-2">
                            <div className="relative w-20 h-10">
                              {isProcessing && (
                                <div className="absolute w-20 h-10 backdrop-blur-[2px] flex items-center justify-center">
                                  <Loading />
                                </div>
                              )}
                              <MediaWrapper
                                data={media.name + '?v=' + imageVersion}
                                className={`w-20 h-10`}
                                isDashboard={true}
                              />
                            </div>
                          </td>

                          <td className="p-2 lg:p-5 text-xs lg:text-base whitespace-pre-line">
                            <img
                              className="h-5 w-5 object-fill mx-auto"
                              src={
                                media.active
                                  ? '/images/success.svg'
                                  : '/images/forbidden.svg'
                              }
                              alt=""
                            />
                          </td>

                          <td className="p-2 lg:p-5 whitespace-pre-line ">
                            <div className="flex mt-1 gap-2 ">
                              <EditMedia
                                editMedia={editMedia}
                                upload={upload}
                                data={media}
                                category={category.category}
                              />
                              {category.category !== 'teams' &&
                                category.category !== 'main' && (
                                  <BiTrashAlt
                                    title="Non aktifkan"
                                    onClick={() => {
                                      delMedia(media.id)
                                    }}
                                    className="text-xl cursor-pointer text-red-600"
                                  />
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      </AdminLayout>
    )
  )
}
