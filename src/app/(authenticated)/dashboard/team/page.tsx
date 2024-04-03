'use client'
import React, { useEffect } from 'react'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import CharLimit from '~/components/charLimit'
import EditTeam from './editTeam'
import AddTeam from './addTeam'
import { useDelete, useGetList } from '~/services/dashboard'
import { groupByAdvisor, groupByCategory } from '~/helpers/utils'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: team } = useGetList('team')
  const { mutate: delMedia } = useDelete('team')
  const grouped: any = groupByAdvisor(team || {})

  const router = useRouter()
  const { status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  return (
    status == 'authenticated' && (
      <AdminLayout>
        <div className="space-y-10 w-full">
          {grouped &&
            Object.keys(grouped).map((keys, idx) => (
              <div key={idx} className="bg-white">
                <div className="flex justify-between items-center">
                  <div className="m-0 text-xl font-extrabold uppercase p-7 text-secondary">
                    {` ${keys} `}
                  </div>
                  <AddTeam category={keys} />
                </div>
                <div className="max-w-full overflow-x-auto">
                  <table className="  w-full">
                    <thead className=" bg-gray-200">
                      <tr>
                        <th className="px-2 py-3 lg:p-5">Name</th>
                        <th className="p-2">Position</th>

                        <th className="px-2 py-3 lg:p-5 w-10">Active</th>
                        <th className="px-2 py-3 lg:p-5 w-14">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[keys].map((media: any, i: any) => (
                        <tr key={i} className=" border-b">
                          <td className="p-2 lg:p-5 text-xs lg:text-base whitespace-pre-line">
                            <CharLimit
                              className="hidden lg:block"
                              text={media.name}
                            />
                            <CharLimit
                              className="lg:hidden"
                              text={media.name}
                              max={50}
                            />
                          </td>
                          <td className="py-2">
                            <CharLimit
                              className="hidden lg:block"
                              text={media.position}
                            />
                            <CharLimit
                              className="lg:hidden"
                              text={media.position}
                              max={50}
                            />
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
                            <EditTeam data={media} category={keys} />
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
