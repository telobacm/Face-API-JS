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
  useEffect(() => {
    const toastMessage = sessionStorage.getItem('toastMessage')
    if (toastMessage) {
      toast.success(toastMessage)
      sessionStorage.removeItem('toastMessage')
    }
  }, [])

  const router = useRouter()
  const {
    data: sessionData,
    status,
    isLoading: isLoadingSession,
  }: any = useSession()
  const { data: currentUser, isLoading: isLoadingUser } =
    useGetList('users/' + sessionData?.user?.id) || {}

  const { mutateAsync: updateUser } = usePatch('users')
  const {
    mutateAsync: updatePassword,
    error: errorUpdatePass,
    isSuccess,
  }: any = usePatch('users/password')

  const [showPass, setShowPass] = useState({
    oldPass: false,
    newPass: false,
    confirmPass: false,
  })

  const [values, setValues] = useState({ newPass: '', confirmPass: '' })
  const [changePass, setchangePass] = useState(false)

  const handleCancel = () => {
    setchangePass(false)
    setShowPass({ oldPass: false, newPass: false, confirmPass: false })
  }

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
    if (isSuccess) {
      toast.success('Password berhasil diperbarui')
    }
  }, [errorUpdatePass, isSuccess])

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
      oldPassword.value = ''
      newPassword.value = ''
      confirmNewPassword.value = ''
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
            <h3 className="text-xl font-bold">Account Info</h3>
          </div>
          <form action="#" className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {currentUser && (
                <div className="grid md:flex justify-between gap-4">
                  <div className="flex-auto grid content-start gap-2">
                    <div className="grid grid-cols-12">
                      <div className="col-span-3 2xl:col-span-2">Name</div>
                      <div className="col-span-9 2xl:col-span-10 font-semibold">
                        : {currentUser?.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-3 2xl:col-span-2">Email</div>
                      <div className="col-span-9 2xl:col-span-10 font-semibold">
                        : {currentUser?.email}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-3 2xl:col-span-2">NIP</div>
                      <div className="col-span-9 2xl:col-span-10 font-semibold">
                        : {currentUser?.nip}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-3 2xl:col-span-2">Gender</div>
                      <div className="col-span-9 2xl:col-span-10 font-semibold">
                        : {currentUser?.gender}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-3 2xl:col-span-2">Jabatan</div>
                      <div className="col-span-9 2xl:col-span-10 font-semibold">
                        :{' '}
                        {currentUser?.position.charAt(0) +
                          currentUser?.position.slice(1).toLowerCase()}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-3 2xl:col-span-2">Kampus</div>
                      <div className="col-span-9 2xl:col-span-10 font-semibold">
                        : {currentUser?.kampus?.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-3 2xl:col-span-2">Unit</div>
                      <div className="col-span-9 2xl:col-span-10 font-semibold">
                        : {currentUser?.unit?.name}
                      </div>
                    </div>
                    {!!currentUser?.subunit?.length && (
                      <div className="grid grid-cols-12">
                        <div className="col-span-3 2xl:col-span-2">SubUnit</div>
                        <div className="col-span-9 2xl:col-span-10 font-semibold">
                          : {currentUser?.subunit?.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setchangePass(!changePass)}
                className="flex gap-3 text-primary "
              >
                Change Password{' '}
                <BiChevronDown className={changePass ? 'rotate-180' : ''} />
              </button>
              {changePass && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="relative">
                      <FloatInput
                        label="Old Password"
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
                          name="confirmNewPassword"
                          onChange={(e: any) =>
                            setValues({
                              ...values,
                              confirmPass: e.target.value,
                            })
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
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className={`bg-primary text-white flex justify-center rounded-xl font-bold py-3 px-5 text-gray`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel()}
                      type="button"
                      className={`bg-red-700 text-white flex justify-center rounded-xl font-bold py-3 px-5 text-gray`}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </AdminLayout>
    )
  )
}
