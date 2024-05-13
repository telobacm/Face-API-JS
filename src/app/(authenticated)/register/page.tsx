'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePost } from '~/services/dashboard'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import RegisterCamera from './RegisterCamera'
import {
  genders,
  kampus,
  positions,
  subUnitDosen,
  subUnitStaff,
  units,
} from '~/helpers/constant'
import { useSession } from 'next-auth/react'

const Register = ({ session }: any) => {
  const router = useRouter()
  const { status, data: sessionData }: any = useSession()
  const role = sessionData?.user?.role
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && role == 'USER') router.push('/reports')
  }, [status, router, role])

  const { mutateAsync: registerUser, error: errorRegisterUser }: any =
    usePost('users')
  const { mutateAsync: recordFace, error: errorRecordFace }: any =
    usePost('descriptors')
  const [faceDescriptors, setFaceDescriptors] = useState<any[]>([])
  const [values, setValues] = useState({ pass: '', confirmPass: '' })
  const [showPass, setShowPass] = useState({
    pass: false,
    confirmPass: false,
  })
  const [position, setPosition] = useState<string>('')
  const [unit, setUnit] = useState<string>('')
  const [subUnit, setSubUnit] = useState<string>('')
  const [subUnitOptions, setSubUnitOptions] = useState(subUnitStaff)

  useEffect(() => {
    if (position === 'STAFF') {
      setSubUnitOptions(subUnitStaff)
    }
    if (position === 'DOSEN') {
      setSubUnitOptions(subUnitDosen)
    }
  }, [position])

  const handleToggleShowPass = (inputName: string) => {
    setShowPass((prevShowPass: any) => ({
      ...prevShowPass,
      [inputName]: !prevShowPass[inputName],
    }))
  }
  const isNotMatch = values.confirmPass && values.pass !== values.confirmPass

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault()
      const {
        fullname,
        nip,
        email,
        kampus,
        gender,
        password,
        confirm_password,
      } = e.target
      const payloadUser: any = {
        name: fullname.value,
        nip: nip.value,
        email: email.value,
        position: position,
        gender: gender.value,
        password: password.value,
        confirm_password: confirm_password.value,
        role: 'USER',
        descriptors: faceDescriptors,
      }

      if (role === 'SUPERADMIN') {
        payloadUser.kampus = kampus.value
      } else if (role === 'ADMIN') {
        payloadUser.kampus = sessionData?.user?.kampus
      }

      if (position !== 'SATPAM') {
        if (role === 'SUPERADMIN') {
          payloadUser.unit = unit
        } else if (role === 'ADMIN') {
          payloadUser.unit = sessionData?.user?.unit
        }
      } else {
        payloadUser.unit = 'Satpam'
      }

      if (position !== 'SATPAM' && !unit.includes('Direktorat')) {
        if (role === 'SUPERADMIN') {
          payloadUser.subunit = subUnit
        } else if (role === 'ADMIN') {
          payloadUser.subunit = sessionData?.user?.unit
        }
      }

      if (password.length < 6) {
        toast.error('Password minimal 6 karakter!')
        return
      }
      if (isNotMatch) {
        toast.error('Password dan Confirm Password tidak cocok!')
        return
      }
      if (faceDescriptors.length < 5) {
        toast.error('Pastikan sudah mengambil 5 foto user!')
        return
      }

      await registerUser(payloadUser)
      router.push('/users')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (errorRegisterUser) {
      toast.error(errorRegisterUser?.response?.data?.message)
    }
  }, [errorRegisterUser])

  useEffect(() => {
    if (errorRecordFace) {
      toast.error(errorRecordFace?.response?.data?.message)
    }
  }, [errorRecordFace])

  return (
    // status == 'authenticated' && (
    <AdminLayout sidebar={true} header={true}>
      <div className="">
        <form
          onSubmit={handleSubmit}
          className="space-4 flex justify-center items-center"
        >
          <div className="md:w-[600px] rounded border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="w-full flex flex-wrap items-center">
              <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
                <div className="w-full py-8 px-4">
                  <h2 className="mb-9 text-2xl text-center font-bold text-black sm:text-title-xl2">
                    Daftarkan User Baru
                  </h2>
                  <div>
                    <label className="mb-1 mt-3 block font-medium text-black">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="fullname"
                        type="text"
                        placeholder="Enter your Fullname"
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 mt-3 block font-medium text-black">
                      NIP
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="nip"
                        type="text"
                        placeholder="Enter NIP"
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 mt-3 block font-medium text-black">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="Enter your Email"
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 mt-3 block font-medium text-black">
                      Jabatan
                    </label>
                    <div className="relative">
                      <select
                        required
                        name="position"
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option
                          value=""
                          disabled
                          selected
                          hidden
                          className="text-gray-400"
                        >
                          Pilih Jabatan
                        </option>
                        {positions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {role === 'SUPERADMIN' ? (
                    <>
                      <div>
                        <label className="mb-1 mt-3 block font-medium text-black">
                          Kampus
                        </label>
                        <div className="relative">
                          <select
                            required
                            name="kampus"
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          >
                            <option
                              value=""
                              disabled
                              selected
                              hidden
                              className="text-gray-400"
                            >
                              Pilih Kampus
                            </option>
                            {kampus.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {position !== 'SATPAM' && (
                        <div>
                          <label className="mb-1 mt-3 block font-medium text-black">
                            Unit
                          </label>
                          <div className="relative">
                            <select
                              required
                              name="unit"
                              onChange={(e) => setUnit(e.target.value)}
                              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            >
                              <option
                                value=""
                                disabled
                                selected
                                hidden
                                className="text-gray-400"
                              >
                                Pilih Unit
                              </option>
                              {units.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                  {position !== 'SATPAM' && !unit.includes('Direktorat') && (
                    <div>
                      <label className="mb-1 mt-3 block font-medium text-black">
                        Sub Unit
                      </label>
                      <div className="relative">
                        <select
                          required
                          name="subunit"
                          onChange={(e) => setSubUnit(e.target.value)}
                          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        >
                          <option
                            value=""
                            disabled
                            selected
                            hidden
                            className="text-gray-400"
                          >
                            Pilih Sub Unit
                          </option>
                          {subUnitOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="mb-1 mt-3 block font-medium text-black">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        required
                        name="gender"
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option
                          value=""
                          disabled
                          selected
                          hidden
                          className="text-gray-400"
                        >
                          Pilih Gender
                        </option>
                        {genders.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <PasswordInput
                    label="Password"
                    name="password"
                    showPass={!!showPass.pass}
                    handleToggleShowPass={() => handleToggleShowPass('pass')}
                    onChange={(e: any) =>
                      setValues({ ...values, pass: e.target.value })
                    }
                  />
                  <PasswordInput
                    label="Confirm Password"
                    name="confirm_password"
                    showPass={!!showPass.confirmPass}
                    error={isNotMatch}
                    handleToggleShowPass={() =>
                      handleToggleShowPass('confirmPass')
                    }
                    onChange={(e: any) =>
                      setValues({ ...values, confirmPass: e.target.value })
                    }
                  />
                  <div className="mt-5">
                    <input
                      type="submit"
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      value="Daftarkan User"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RegisterCamera
            faceDescriptors={faceDescriptors}
            setFaceDescriptors={setFaceDescriptors}
          />
        </form>
      </div>
    </AdminLayout>
  )
  // )
}

function PasswordInput({
  label,
  showPass = false,
  error,
  onChange,
  handleToggleShowPass,
  name,
}: any) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 mt-3 block font-medium text-black">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          onChange={onChange}
          required
          type={showPass ? 'text' : 'password'}
          placeholder=" "
          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />

        <span className="absolute right-4 top-4 text-2xl cursor-pointer opacity-50">
          <AiOutlineEye
            className={showPass ? 'hidden' : ''}
            onClick={handleToggleShowPass}
          />
          <AiOutlineEyeInvisible
            className={showPass ? '' : 'hidden'}
            onClick={handleToggleShowPass}
          />
        </span>
      </div>
      {error && (
        <div className="text-red-500 text-xs pl-1">
          Password dan Confirm Password tidak cocok!{' '}
        </div>
      )}
    </div>
  )
}

export default Register
