'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BiChevronDown } from 'react-icons/bi'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useGetList, usePatch } from '~/services/dashboard'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import FloatInput from '~/components/floatInput'
import Loading from '~/components/loading'

export default function Setting() {
  const router = useRouter()
  const {
    data: sessionData,
    status,
    isLoading: isLoadingSession,
  }: any = useSession()
  const { data: currentUser, isLoading: isLoadingUser } =
    useGetList('users/' + sessionData?.user?.id) || {}
  console.log('currentUser', currentUser)

  const { mutateAsync: updateUser } = usePatch('users')
  const { mutateAsync: updatePassword, error: errorUpdatePass }: any =
    usePatch('users/password')

  const [isEdit, setisEdit] = useState(true)

  const [showPass, setShowPass] = useState({
    oldPass: false,
    newPass: false,
    confirmPass: false,
  })

  const [values, setValues] = useState({ newPass: '', confirmPass: '' })
  const [changePass, setchangePass] = useState(false)

  useEffect(() => {
    // if (!isLoadingSession) {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    // }
  }, [status, isLoadingSession, router])

  useEffect(() => {
    if (errorUpdatePass) {
      toast.error(errorUpdatePass?.response?.data?.message)
    }
  }, [errorUpdatePass])

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault()
      const { oldPassword, newPassword, confirmNewPassword, name } = e.target

      await updateUser({
        id: currentUser?.id,
        payload: { name: name.value },
      })
      if (changePass) {
        await updatePassword({
          id: currentUser?.id,
          payload: {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            confirmNewPassword: confirmNewPassword.value,
          },
        })
      }
      setisEdit(false)
    } catch (error) {
      console.error('error', error)
    }
  }
  const handleToggleShowPass = (inputName: string) => {
    setShowPass((prevShowPass: any) => ({
      ...prevShowPass,
      [inputName]: !prevShowPass[inputName],
    }))
  }

  const isLoading = isLoadingSession && isLoadingUser

  if (isLoading) {
    return <Loading />
  }
  return (
    status === 'authenticated' && (
      <AdminLayout>
        <div className="rounded-xl   bg-white shadow p-6 lg:p-10 ">
          <div className=" pb-4 ">
            <h3 className="text-xl font-bold">Account Setting</h3>
          </div>
          <form action="#" className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {currentUser && (
                <>
                  <FloatInput
                    readOnly
                    disabled={!isEdit}
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    defaultValue={currentUser?.name}
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={currentUser?.email}
                    placeholder="Enter your email address"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="NIP"
                    name="nip"
                    type="text"
                    defaultValue={currentUser?.nip}
                    // placeholder="Enter your NIP"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Position"
                    name="position"
                    type="text"
                    defaultValue={currentUser?.position}
                    // placeholder="Enter your NIP"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Kampus"
                    name="kampus"
                    type="text"
                    defaultValue={currentUser?.kampus?.name}
                    // placeholder="Enter your kampus"
                    className="cursor-not-allowed"
                  />
                  <FloatInput
                    readOnly
                    label="Unit"
                    name="unit"
                    type="text"
                    defaultValue={currentUser?.unit?.name}
                    // placeholder="Enter your kampus"
                    className="cursor-not-allowed"
                  />
                  {currentUser?.subunit && (
                    <FloatInput
                      readOnly
                      label="SubUnit"
                      name="subunit"
                      type="text"
                      defaultValue={currentUser?.subunit?.name}
                      // placeholder="Enter your kampus"
                      className="cursor-not-allowed"
                    />
                  )}
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setchangePass(!changePass)}
              className="flex gap-3 text-primary "
            >
              Change Password{' '}
              <BiChevronDown className={changePass ? 'rotate-180' : ''} />
            </button>
            {changePass && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="relative">
                  <FloatInput
                    label="Old Password"
                    disabled={!isEdit}
                    required
                    type={showPass.oldPass ? 'text' : 'password'}
                    name="oldPassword"
                    placeholder=" "
                  />
                  <span className="absolute right-3 top-3 text-2xl cursor-pointer">
                    <AiOutlineEye
                      className={showPass.oldPass ? 'hidden' : ''}
                      onClick={() => handleToggleShowPass('oldPass')}
                    />
                    <AiOutlineEyeInvisible
                      className={showPass.oldPass ? '' : 'hidden'}
                      onClick={() => handleToggleShowPass('oldPass')}
                    />
                  </span>
                </div>
                <div className="relative">
                  <FloatInput
                    label="New Password"
                    disabled={!isEdit}
                    required
                    name="newPassword"
                    type={showPass.newPass ? 'text' : 'password'}
                    onChange={(e: any) =>
                      setValues({ ...values, newPass: e.target.value })
                    }
                    placeholder=" "
                  />
                  <span className="absolute right-3 top-3 text-2xl cursor-pointer">
                    <AiOutlineEye
                      className={showPass.newPass ? 'hidden' : ''}
                      onClick={() => handleToggleShowPass('newPass')}
                    />
                    <AiOutlineEyeInvisible
                      className={showPass.newPass ? '' : 'hidden'}
                      onClick={() => handleToggleShowPass('newPass')}
                    />
                  </span>
                </div>
                <div>
                  <div className="relative">
                    <FloatInput
                      label="Confirm New Password"
                      disabled={!isEdit}
                      name="confirmNewPassword"
                      onChange={(e: any) =>
                        setValues({ ...values, confirmPass: e.target.value })
                      }
                      required
                      type={showPass.confirmPass ? 'text' : 'password'}
                      placeholder=" "
                    />

                    <span className="absolute right-3 top-3 text-2xl cursor-pointer">
                      <AiOutlineEye
                        className={showPass.confirmPass ? 'hidden' : ''}
                        onClick={() => handleToggleShowPass('confirmPass')}
                      />
                      <AiOutlineEyeInvisible
                        className={showPass.confirmPass ? '' : 'hidden'}
                        onClick={() => handleToggleShowPass('confirmPass')}
                      />
                    </span>
                  </div>
                  {values.confirmPass &&
                    values.newPass !== values.confirmPass && (
                      <div className="text-red-500 text-xs pl-1">
                        New Password and Confirm New Password do not match!{' '}
                      </div>
                    )}
                </div>
              </div>
            )}

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
