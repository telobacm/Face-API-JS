'use client'
import React, { useEffect } from 'react'
import { BiPencil } from 'react-icons/bi'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import CharLimit from '~/components/charLimit'
import { groupByCategory } from '~/helpers/utils'
import EditSocialModal from './editSocialModal'
import { useGetList } from '~/services/dashboard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Social() {
  const { data: socials } = useGetList('social')

  const grouped = groupByCategory(socials || [])
  const router = useRouter()
  const { status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])
  return (
    status == 'authenticated' && (
      <AdminLayout>
        <div className="space-y-10">
          {!!grouped?.length &&
            grouped.map((category, i1) => (
              <div key={i1} className="bg-white">
                <h1 className="m-0 text-xl font-extrabold uppercase p-7 text-secondary">
                  {' '}
                  {category.category}{' '}
                </h1>
                <div className="max-w-full overflow-x-auto">
                  <table className="  w-full">
                    <thead className=" bg-gray-200 mt-10">
                      <tr>
                        <th className="px-2 py-3 lg:p-5 w-1/2">Link</th>
                        <th className="px-2 py-3 lg:p-5">Location</th>
                        <th className="px-2 py-3 lg:p-5 w-9">Active</th>
                        <th className="px-2 py-3 lg:p-5 w-9">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((social: any, i: any) => (
                        <tr key={i} className=" border-b">
                          <td className="p-2 lg:p-5 text-xs lg:text-base">
                            <a
                              href={social.link}
                              target="_blank"
                              className="whitespace-pre-line hover:text-blue-300"
                            >
                              {social.link ? (
                                <CharLimit text={social.link} max={50} />
                              ) : (
                                '---'
                              )}
                            </a>
                          </td>
                          <td className="p-2 lg:p-5 text-xs lg:text-base">
                            {social.location ? (
                              <>
                                <CharLimit
                                  className="hidden lg:block"
                                  text={social.location}
                                />
                                <CharLimit
                                  className="lg:hidden"
                                  text={social.location}
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
                                social.active
                                  ? '/images/success.svg'
                                  : '/images/forbidden.svg'
                              }
                              alt=""
                            />
                          </td>
                          <td className="p-2 lg:p-5">
                            <EditSocialModal data={social} />
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
