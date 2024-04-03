'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { BiLock, BiMailSend, BiLogoGoogle } from 'react-icons/bi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'

const Login = ({ session }: any) => {
  const router = useRouter()
  const { status, data }: any = useSession()
  const role = data?.user?.role
  useEffect(() => {
    if (status == 'authenticated') {
      router.push(role === 'USER' ? 'dashboard/settings' : 'dashboard')
    }
  }, [status, router, role])

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault()
      const email = e.target.email.value
      const password = e.target.password.value
      if (email === '') return toast.error('Email cannot be empty!')
      if (password === '') return toast.error('Password cannot be empty!')

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long')
        return
      }

      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error == null) {
        toast.success('Success!')
        router.push('/dashboard')
      } else {
        toast.error('Incorrect Email or Password!')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SessionProvider session={session}>
      <AdminLayout sidebar={false} header={false}>
        <div className="flex h-screen justify-center items-center">
          <div className="md:w-[600px] rounded border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="w-full flex flex-wrap items-center">
              <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  <h2 className="mb-9 text-2xl text-center font-bold text-black dark:text-white sm:text-title-xl2">
                    Sign In
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                          <BiMailSend className="text-2xl opacity-50" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          name="password"
                          type="password"
                          placeholder="6+ Characters, 1 Capital letter"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                          <BiLock className="text-2xl opacity-50" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-5">
                      <input
                        type="submit"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        value="Sign In"
                      />
                    </div>
                    {/* <div className="cursor-pointer flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                      <span>
                        <BiLogoGoogle className="text-2xl opacity-50" />
                      </span>
                      Sign in with Google
                    </div> */}
                    <div className="mt-6 text-center">
                      <div>
                        Don&apos;t have any account?
                        <Link href="/register" className="text-slate-400 pl-2">
                          Register
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </SessionProvider>
  )
}

export default Login
