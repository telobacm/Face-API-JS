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

export default function Setting() {
  const router = useRouter()
  const { data: session, status }: any = useSession()
  const { data: currentUser } = useGetList('user/' + session?.user?.id) || {}
  const { mutateAsync: updateUser } = usePatch('user')
  const { mutateAsync: updatePassword, error: errorUpdatePass }: any =
    usePatch('user/password')

  const [isEdit, setisEdit] = useState(true)

  const [showPass, setShowPass] = useState({
    oldPass: false,
    newPass: false,
    confirmPass: false,
  })

  const [values, setValues] = useState({ newPass: '', confirmPass: '' })
  const [changePass, setchangePass] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (errorUpdatePass) {
      toast.error(errorUpdatePass?.response?.data?.message)
    }
  }, [errorUpdatePass])

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault()
      const { oldPassword, newPassword, confirmNewPassword, fullname, email } =
        e.target
      await updateUser({
        id: currentUser?.id,
        payload: { fullname: fullname.value },
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

  return (
    status == 'authenticated' && (
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
                    disabled={!isEdit}
                    label="Full Name"
                    name="fullname"
                    type="text"
                    placeholder="Full Name"
                    defaultValue={currentUser?.fullname}
                    // className="w-full rounded border-[1.5px]  bg-transparent py-3 px-5  outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <FloatInput
                    readOnly
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={currentUser?.email}
                    placeholder="Enter your email address"
                    // className="w-full rounded border-[1.5px]  bg-transparent py-3 px-5  outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
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
                  className={`bg-red-800 text-white flex w-full justify-center rounded  font-bold p-3  text-gray`}
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
              className={`bg-red-800 text-primary flex w-full justify-center rounded  font-bold p-3  text-gray mt-10`}
            >
              EDIT
            </button>
          )}
        </div>
      </AdminLayout>
    )
  )
}
