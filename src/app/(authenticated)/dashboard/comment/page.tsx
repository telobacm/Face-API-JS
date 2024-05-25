'use client'
import React, { useEffect } from 'react'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import CharLimit from '~/components/charLimit'
import EditComment from './editComment'
import AddComment from './addComment'
import { useGetList } from '~/services/dashboard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: comment } = useGetList('comment', { active: true })
  const router = useRouter()
  const { status } = useSession()
  useEffect(() => {
    // if (status === 'unauthenticated') router.push('/login')
  }, [status, router])
  return (
    // status == 'authenticated' && (
    <AdminLayout>
      <div className="mb-5">
        <AddComment />
      </div>
      <div className="bg-white">
        <div className="max-w-full overflow-x-auto">
          <table className="  w-full">
            <thead className=" bg-gray-200">
              <tr>
                <th className="px-2 py-3 lg:p-5 w-1/4">Name</th>
                <th className="px-2 py-3 lg:p-5">Content</th>
                <th className="px-2 py-3 lg:p-5 w-9">Image</th>
                <th className="px-2 py-3 lg:p-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {!!comment?.length &&
                comment.map((comment: any, i: any) => (
                  <tr key={i} className=" border-b">
                    <td className="p-2 lg:p-5 text-xs lg:text-base whitespace-pre-line">
                      <CharLimit
                        className="hidden lg:block"
                        text={comment.name}
                      />
                      <CharLimit
                        className="lg:hidden"
                        text={comment.name}
                        max={50}
                      />
                    </td>
                    <td className="p-2 lg:p-5 text-xs lg:text-base whitespace-pre-line">
                      <CharLimit
                        className="hidden lg:block"
                        text={comment.content}
                      />
                      <CharLimit
                        className="lg:hidden"
                        text={comment.content}
                        max={50}
                      />
                    </td>
                    <td className="p-2 lg:p-5">
                      <img
                        className="h-5 w-5 object-fill mx-auto"
                        src={
                          comment.photo
                            ? '/images/success.svg'
                            : '/images/forbidden.svg'
                        }
                        alt=""
                      />
                    </td>

                    <td className="p-2 lg:p-5 whitespace-pre-line ">
                      <EditComment data={comment} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
    // )
  )
}
