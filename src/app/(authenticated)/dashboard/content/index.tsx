'use client'
import React, { useEffect } from 'react'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import CharLimit from '~/components/charLimit'
import { groupByPage } from '~/helpers/utils'
import EditContentModal from './editContentModal'
import { useGetList } from '~/services/dashboard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
export default function Content() {
  const { data: contents } = useGetList('content')
  const router = useRouter()
  const { status, data }: any = useSession()
  const role = data?.user?.role
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && role == 'USER')
      router.push('/dashboard/settings')
  }, [status, router, role])

  const grouped = groupByPage(contents || [])

  return (
    status == 'authenticated' && (
      <AdminLayout>
        <div className="space-y-10">
          {!!grouped?.length &&
            grouped.map((page, i1) => (
              <div key={i1} className="bg-white">
                <h1 className="m-0 text-xl font-extrabold uppercase p-7 text-secondary">
                  {' '}
                  {page.page}{' '}
                </h1>
                <div className="max-w-full overflow-x-auto">
                  <table className="  w-full">
                    <thead className=" bg-gray-200 mt-10">
                      <tr>
                        <th className="px-2 py-3 lg:p-5 w-1/4">Title</th>
                        <th className="px-2 py-3 lg:p-5">Description</th>
                        <th className="px-2 py-3 lg:p-5 w-9">Image</th>
                        <th className="px-2 py-3 lg:p-5">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.items.map((content: any, i: any) => (
                        <tr key={i} className=" border-b">
                          <td className="p-2 lg:p-5 text-xs lg:text-base">
                            {content.title ? (
                              <CharLimit text={content.title} max={50} />
                            ) : (
                              '---'
                            )}
                          </td>
                          <td className="p-2 lg:p-5 text-xs lg:text-base">
                            {content.description ? (
                              <>
                                <CharLimit
                                  className="hidden lg:block"
                                  text={content.description}
                                />
                                <CharLimit
                                  className="lg:hidden"
                                  text={content.description}
                                  max={50}
                                />
                              </>
                            ) : (
                              '....'
                            )}
                          </td>
                          <td className="p-2 lg:p-5">
                            <img
                              className="h-5 w-5 object-fill mx-auto"
                              src={
                                content.image
                                  ? '/images/success.svg'
                                  : '/images/forbidden.svg'
                              }
                              alt=""
                            />
                          </td>
                          <td className="p-2 lg:p-5">
                            <EditContentModal data={content} />
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
