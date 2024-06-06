'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useGetList, usePost } from '~/services/dashboard'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import RegisterCamera from './RegisterCamera'
import { genders, positions } from '~/helpers/constant'
import Loading from '~/components/loading'
import { useSession } from 'next-auth/react'

const Register = () => {
  const router = useRouter()
  const { status, data: sessionData }: any = useSession()
  const role = sessionData?.user?.role
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && role == 'USER')
      router.push(`/reports/${sessionData?.user?.id}`)
  }, [status, router, role])

  const { data: kampus, isLoading: isLoadingKampus } = useGetList('kampus')
  const { data: units, isLoading: isLoadingUnits } = useGetList('unit')
  const { data: subUnitDosen, isLoading: isLoadingSubUnitDosen } = useGetList(
    'subunit',
    { filter: { position: 'DOSEN' } },
  )
  const { data: subUnitStaff, isLoading: isLoadingSubUnitStaff } = useGetList(
    'subunit',
    { filter: { position: 'STAFF' } },
  )
  const { mutateAsync: registerUser, error: errorRegisterUser }: any =
    usePost('users')
  const [faceDescriptors, setFaceDescriptors] = useState<any[]>([])
  const [values, setValues] = useState({ pass: '', confirmPass: '' })
  const [showPass, setShowPass] = useState({
    pass: false,
    confirmPass: false,
  })
  const [position, setPosition] = useState<string>('')
  const [unit, setUnit] = useState<string>('')
  const [unitLabel, setUnitLabel] = useState<string>('')
  const [subUnit, setSubUnit] = useState<string>('')
  const [subUnitOptions, setSubUnitOptions] = useState(subUnitStaff)

  //Jika yang buka Admin Unit, unitLabel dari session dimasukkan, untuk tahu butuh subUnit tidak
  useEffect(() => {
    if (role === 'ADMIN') {
      setUnitLabel(sessionData?.user?.unitLabel)
    }
  }, [role])

  useEffect(() => {
    if (position === 'DOSEN') {
      setSubUnitOptions(subUnitDosen)
    } else {
      setSubUnitOptions(subUnitStaff)
    }
  }, [position])

  const unitChange = (x: any) => {
    const id = x.split('/')[0]
    const name = x.split('/')[1]
    setUnit(id)
    setUnitLabel(name)
  }

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
        email,
        nip,
        kampus,
        gender,
        password,
        confirm_password,
      } = e.target
      const payloadUser: any = {
        name: fullname.value,
        email: email.value,
        nip: nip.value,
        position: position,
        gender: gender.value,
        password: password.value,
        confirm_password: confirm_password.value,
        role: 'USER',
        descriptors: faceDescriptors,
      }
      console.log(sessionData)

      if (role === 'SUPERADMIN') {
        payloadUser.kampus = { connect: { id: parseInt(kampus.value) } }
        payloadUser.unit = { connect: { id: parseInt(unit) } }
      } else {
        payloadUser.kampus = {
          connect: { id: parseInt(sessionData?.user.kampusId) },
        }
        payloadUser.unit = {
          connect: { id: parseInt(sessionData?.user.unitId) },
        }
      }

      if (!unitLabel.includes('Direktorat')) {
        payloadUser.subunit = { connect: { id: parseInt(subUnit) } }
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

      const res = await registerUser(payloadUser)
      if (res?.error == null) {
        toast.success('User berhasil ditambahkan.')
        sessionStorage.setItem('toastMessage', 'User berhasil ditambahkan.')
        router.push('/users')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (errorRegisterUser) {
      toast.error(errorRegisterUser?.response?.data?.message)
    }
  }, [errorRegisterUser])

  // console.log('kampus', kampus)
  // console.log('units', units)
  // console.log('subUnitDosen', subUnitDosen)
  // console.log('subUnitStaff', subUnitStaff)

  const isLoading =
    isLoadingKampus &&
    isLoadingUnits &&
    isLoadingSubUnitDosen &&
    isLoadingSubUnitStaff

  if (isLoading) {
    return <Loading />
  }
  return (
    <AdminLayout sidebar={true} header={true}>
      <div className="grid md:flex items-center">
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
                      Email
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="email"
                        type="email"
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
                  <div>
                    <label className="mb-1 mt-3 block font-medium text-black">
                      Kampus
                    </label>
                    <div className="relative">
                      {role !== 'ADMIN' ? (
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
                          {!!kampus?.length &&
                            kampus?.map((x: any, i: number) => (
                              <option key={i} value={x?.id}>
                                {x?.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <div className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none text-gray-600 cursor-not-allowed">
                          {!!sessionData && sessionData?.user?.kampusLabel}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 mt-3 block font-medium text-black">
                      Unit
                    </label>
                    <div className="relative">
                      {role !== 'ADMIN' ? (
                        <select
                          required
                          name="unit"
                          onChange={(e) => unitChange(e.target.value)}
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
                          {!!units?.length &&
                            units?.map((x: any, i: number) => (
                              <option key={i} value={x.id + '/' + x.name}>
                                {x?.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <div className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none text-gray-600 cursor-not-allowed">
                          {!!sessionData && sessionData?.user?.unitLabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {!unitLabel.length || !unitLabel.includes('Direktorat') ? (
                    <div>
                      <label className="mb-1 mt-3 block font-medium text-black">
                        Sub Unit
                      </label>
                      <div className="relative">
                        <select
                          required
                          name="subunit"
                          disabled={!position.length}
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
                          {!!subUnitOptions?.length &&
                            subUnitOptions?.map((x: any, i: number) => (
                              <option key={i} value={x?.id}>
                                {x?.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    ''
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
        </form>
        <RegisterCamera
          faceDescriptors={faceDescriptors}
          setFaceDescriptors={setFaceDescriptors}
        />
      </div>
    </AdminLayout>
  )
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
