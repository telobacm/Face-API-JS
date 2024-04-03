'use client'
import React, { useEffect } from 'react'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import CharLimit from '~/components/charLimit'
import EditElfsight from './editElfSight'
import { useGetList } from '~/services/dashboard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: dataElfSight } = useGetList('elfsight', { active: true })
  const router = useRouter()
  const { status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])
  return (
    status == 'authenticated' && (
      <AdminLayout>
        <div className="bg-white">
          <div className="max-w-full overflow-x-auto">
            <table className="  w-full">
              <thead className=" bg-gray-200">
                <tr>
                  <th className="px-2 py-3 lg:p-5">Class</th>
                  <th className="px-2 py-3 lg:p-5">Category</th>
                  <th className="px-2 py-3 lg:p-5 w-1/4">Action</th>
                </tr>
              </thead>
              <tbody>
                {!!dataElfSight?.length &&
                  dataElfSight.map((elf: any, i: any) => (
                    <tr key={i} className=" border-b">
                      <td className="p-2 lg:p-5 text-xs lg:text-base whitespace-pre-line">
                        <CharLimit
                          className="hidden lg:block"
                          text={elf.class}
                        />
                        <CharLimit
                          className="lg:hidden"
                          text={elf.class}
                          max={50}
                        />
                      </td>
                      <td className="p-2 lg:p-5 text-xs lg:text-base whitespace-pre-line">
                        <CharLimit
                          className="hidden lg:block"
                          text={elf.category}
                        />
                        <CharLimit
                          className="lg:hidden"
                          text={elf.category}
                          max={50}
                        />
                      </td>

                      <td className="p-2 lg:p-5 flex justify-center whitespace-pre-line ">
                        <EditElfsight data={elf} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    )
  )
}
