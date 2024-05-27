'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useGetList, usePatch } from '~/services/dashboard'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import FloatInput from '~/components/floatInput'
import Loading from '~/components/loading'
import { BiChevronLeft } from 'react-icons/bi'
import Link from 'next/link'

export default function UserDetailPage(props: any) {
  const router = useRouter()
  const { data: sessionData, status }: any = useSession()
  const role = sessionData?.user?.role

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (status === 'authenticated' && role === 'USER') {
      router.push('/reports')
    }
  }, [status, router, role])

  const id = props?.params?.id
  const { data: userDetail, isLoading: isLoadingUserDetail } =
    useGetList('users/' + id) || {}

  const { mutateAsync: updateUser } = usePatch('users')
  const [isEdit, setisEdit] = useState(true)

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault()
      const { name } = e.target

      await updateUser({
        id: userDetail?.id,
        payload: { name: name.value },
      })
      setisEdit(false)
    } catch (error) {
      console.error('error', error)
    }
  }

  if (isLoadingUserDetail) {
    return <Loading />
  }
  return (
    status == 'authenticated' && (
      <AdminLayout>
        <div className="text-lg font-semibold hover:font-bold text-black hover:text-red-600">
          <Link href="users/" className="flex items-center w-fit">
            <BiChevronLeft /> Back
          </Link>
        </div>
        <div className="rounded-xl   bg-white shadow p-6 lg:p-10 ">
          <div className=" pb-4 ">
            <h3 className="text-xl font-bold">Account Setting</h3>
          </div>
          <form action="#" className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {userDetail && (
                <>
                  <FloatInput
                    readOnly
                    disabled={!isEdit}
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    defaultValue={userDetail?.name}
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={userDetail?.email}
                    placeholder="Enter your email address"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="NIP"
                    name="nip"
                    type="text"
                    defaultValue={userDetail?.nip}
                    // placeholder="Enter your NIP"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Position"
                    name="position"
                    type="text"
                    defaultValue={userDetail?.position}
                    // placeholder="Enter your NIP"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Kampus"
                    name="kampus"
                    type="text"
                    defaultValue={userDetail?.kampus?.name}
                    // placeholder="Enter your kampus"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Unit"
                    name="unit"
                    type="text"
                    defaultValue={userDetail?.unit?.name}
                    // placeholder="Enter your kampus"
                    className="cursor-not-allowed"
                  />
                  {userDetail?.subunit && (
                    <FloatInput
                      readOnly
                      label="SubUnit"
                      name="subunit"
                      type="text"
                      defaultValue={userDetail?.subunit?.name}
                      // placeholder="Enter your kampus"
                      className="cursor-not-allowed"
                    />
                  )}
                </>
              )}
            </div>

            {isEdit && (
              <div className="flex justify-between gap-5">
                <button
                  onClick={() => setisEdit(false)}
                  type="button"
                  className={`bg-red-700 text-white flex w-full justify-center rounded  font-bold p-3  text-gray`}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className={`bg-primary text-white flex w-full justify-center rounded  font-bold p-3  text-gray`}
                >
                  SAVE
                </button>
              </div>
            )}
          </form>
          {!isEdit && (
            <button
              type={'button'}
              onClick={() => setisEdit(true)}
              className={`bg-red-700 text-white flex w-full justify-center rounded  font-bold p-3  text-gray mt-10`}
            >
              EDIT
            </button>
          )}
        </div>
      </AdminLayout>
    )
  )
}
