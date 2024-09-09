'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { toast } from 'react-toastify'
import AdminLayout from '~/app/(authenticated)/components/layoutAdmin'
import Loading from '~/components/loading'
import { genders, positions } from '~/helpers/constant'
import { useGetList, usePatch } from '~/services/dashboard'
import EditCamera from './EditCamera'
import Link from 'next/link'
import { BiChevronLeft, BiSolidPencil } from 'react-icons/bi'
import DeleteItem from '../../components/deleteItem'

export default function EditUser(props: any) {
  const router = useRouter()
  const { status, data: sessionData }: any = useSession()
  const sessionRole = sessionData?.user?.role
  const userId = props?.params?.id
  const { data, isLoading: isLoadingUser } = useGetList(`users/${userId}`)

  const {
    data: campuses,
    isLoading: isLoadingKampus,
    isSuccess: isSuccessUser,
  } = useGetList('kampus')
  const { data: units, isLoading: isLoadingUnits } = useGetList('unit')
  const { data: subUnitDosen, isLoading: isLoadingSubUnitDosen } = useGetList(
    'subunit',
    { filter: { position: 'DOSEN' } },
  )
  const { data: subUnitStaff, isLoading: isLoadingSubUnitStaff } = useGetList(
    'subunit',
    { filter: { position: 'STAFF' } },
  )

  const { mutateAsync: edit } = usePatch('users')

  const [showPass, setShowPass] = useState(false)
  const [whiteListCheck, setWhiteListCheck] = useState(false)
  const [position, setPosition] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [kampus, setKampus] = useState<string>('')
  const [unit, setUnit] = useState<string>('')
  const [unitLabel, setUnitLabel] = useState<string>('')
  const [subUnit, setSubUnit] = useState<string>('')
  const [subUnitOptions, setSubUnitOptions] = useState(subUnitStaff)
  const [faceDescriptors, setFaceDescriptors] = useState<any[]>([])

  const [editPosition, setEditPosition] = useState<boolean>(false)
  const [editKampus, setEditKampus] = useState<boolean>(false)
  const [editUnit, setEditUnit] = useState<boolean>(false)
  const [editSubUnit, setEditSubUnit] = useState<boolean>(false)
  const [editGender, setEditGender] = useState<boolean>(false)
  const [editRole, setEditRole] = useState<boolean>(false)

  const [changePhotos, setChangePhotos] = useState(false)
  const [photosComplete, setPhotosComplete] = useState(false)

  useEffect(() => {
    setPosition(data?.position)
    setWhiteListCheck(data?.whitelist)
    setUnitLabel(data?.unit?.name)
  }, [data])

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

  const handleToggleShowPass = () => {
    setShowPass((prevShowPass: any) => !prevShowPass)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const { name, email, nip, password, whitelist } = e.target

      const payload: any = {
        name: name.value,
        email: email.value,
        nip: nip.value,
        position: position,
        password: password.value,
        whitelist: whitelist.checked,
      }
      if (sessionRole === 'SUPERADMIN') {
        if (!!kampus.length) {
          payload.kampus = { connect: { id: parseInt(kampus) } }
        }
        if (!!unit.length) {
          payload.unit = { connect: { id: parseInt(unit) } }
        }
      }
      if (!!subUnit.length) {
        payload.subunit = { connect: { id: parseInt(subUnit) } }
      }
      if (!!gender.length) {
        payload.gender = gender
      }
      if (!!role.length) {
        payload.role = role
      }
      if (!!changePhotos && !!photosComplete) {
        payload.descriptors = faceDescriptors
      }

      const res = await edit({ id: data?.id, payload })
      if (res?.error == null) {
        toast.success('Edit User berhasil !')
        sessionStorage.setItem('toastMessage', 'Edit User berhasil !')
        router.push('/users')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (status === 'authenticated' && sessionRole === 'USER')
      router.push(`/reports/${sessionData?.user?.id}`)
  }, [status, router, sessionRole])

  const isLoading =
    isLoadingUser &&
    isLoadingKampus &&
    isLoadingUnits &&
    isLoadingSubUnitDosen &&
    isLoadingSubUnitStaff

  if (isLoading) {
    return <Loading />
  }

  return (
    status == 'authenticated' && (
      <AdminLayout sidebar={true} header={true}>
        <Link
          href="./"
          className="flex items-center w-fit text-lg font-semibold mb-3 hover:font-bold text-black hover:text-red-600"
        >
          <BiChevronLeft /> Back
        </Link>
        <div className="text-2xl font-semibold text-black mb-2">Edit User</div>
        <div className="grid divide-y">
          <form onSubmit={handleSubmit}>
            <div className="grid md:flex items-center">
              <div className="space-4 flex justify-center items-center">
                <div className="md:w-[650px]">
                  <div className="w-full grid gap-2 items-center">
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Nama :</label>
                      <div className="relative">
                        <input
                          required
                          name="name"
                          type="text"
                          defaultValue={data?.name}
                          placeholder="Enter password"
                          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Email :</label>
                      <div className="relative">
                        <input
                          required
                          name="email"
                          type="text"
                          defaultValue={data?.email}
                          placeholder="Enter email"
                          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">NIP :</label>
                      <div className="relative">
                        <input
                          required
                          name="nip"
                          type="text"
                          defaultValue={data?.nip}
                          placeholder="Enter NIP"
                          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Jabatan :</label>
                      {!editPosition ? (
                        <div className="flex items-center gap-1.5 py-1.5">
                          <p>
                            {data?.position.charAt(0) +
                              data?.position.slice(1).toLowerCase()}
                          </p>
                          <button
                            onClick={() => setEditPosition(true)}
                            className="w-fit p-2.5 hover:text-blue-500 text-gray-600"
                          >
                            <BiSolidPencil />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            name="position"
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            defaultValue={data?.position}
                            onChange={(e) => setPosition(e.target.value)}
                          >
                            {positions.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Kampus :</label>
                      {!editKampus ? (
                        <div className="flex items-center gap-1.5 py-1.5">
                          <p> {data?.kampus?.name}</p>
                          {sessionRole === 'SUPERADMIN' ? (
                            <button
                              onClick={() => setEditKampus(true)}
                              className="w-fit p-2.5 hover:text-blue-500 text-gray-600"
                            >
                              <BiSolidPencil />
                            </button>
                          ) : (
                            ''
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            name="kampus"
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            defaultValue={data?.kampusId}
                            onChange={(e) => setKampus(e.target.value)}
                          >
                            {!!campuses?.length &&
                              campuses?.map((x: any, i: number) => (
                                <option key={i} value={x?.id}>
                                  {x?.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Unit :</label>
                      {!editUnit ? (
                        <div className="flex items-center gap-1.5 py-1.5">
                          <p> {data?.unit?.name}</p>
                          {sessionRole === 'SUPERADMIN' ? (
                            <button
                              onClick={() => setEditUnit(true)}
                              className="w-fit p-2.5 hover:text-blue-500 text-gray-600"
                            >
                              <BiSolidPencil />
                            </button>
                          ) : (
                            ''
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            name="unit"
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            defaultValue={`${data?.unitId}/${data?.unit?.name}`}
                            onChange={(e) => unitChange(e.target.value)}
                          >
                            {!!units?.length &&
                              units?.map((x: any, i: number) => (
                                <option key={i} value={x.id + '/' + x.name}>
                                  {x?.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                    {!unitLabel?.includes('Direktorat') ? (
                      <div className="flex items-center gap-1.5">
                        <label className="mb-1 mt-3 block font-medium text-black">
                          SubUnit :
                        </label>
                        {!editSubUnit ? (
                          <div className="flex items-center gap-1.5 py-1.5">
                            <p> {data?.subunit?.name}</p>
                            <button
                              onClick={() => setEditSubUnit(true)}
                              className="w-fit p-2.5 hover:text-blue-500 text-gray-600"
                            >
                              <BiSolidPencil />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <select
                              required
                              name="subunit"
                              // disabled={!position.length}
                              onChange={(e) => setSubUnit(e.target.value)}
                              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              defaultValue={data?.subunitId}
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
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Gender :</label>
                      {!editGender ? (
                        <div className="flex items-center gap-1.5 py-1.5">
                          <p>{data?.gender}</p>
                          <button
                            onClick={() => setEditGender(true)}
                            className="w-fit p-2.5 hover:text-blue-500 text-gray-600"
                          >
                            <BiSolidPencil />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            name="gender"
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            defaultValue={data?.gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            {genders.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Password :</label>
                      <div className="relative">
                        <input
                          required
                          name="password"
                          type={showPass ? 'text' : 'password'}
                          defaultValue={data?.password}
                          placeholder="Enter password"
                          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                      <span className="text-2xl cursor-pointer opacity-75">
                        {showPass ? (
                          <AiOutlineEye onClick={handleToggleShowPass} />
                        ) : (
                          <AiOutlineEyeInvisible
                            onClick={handleToggleShowPass}
                          />
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-black">Role :</label>
                      {!editRole ? (
                        <div className="flex items-center gap-1.5 py-1.5">
                          <p>
                            {data?.role.charAt(0) +
                              data?.role.slice(1).toLowerCase()}
                          </p>
                          {sessionRole === 'SUPERADMIN' ? (
                            <button
                              onClick={() => setEditRole(true)}
                              className="w-fit p-2.5 hover:text-blue-500 text-gray-600"
                            >
                              <BiSolidPencil />
                            </button>
                          ) : (
                            ''
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            required
                            name="role"
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            defaultValue={data?.role}
                            onChange={(e) => setRole(e.target.value)}
                          >
                            <option value="SUPERADMIN">Super Admin</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="mt-4 text-black">Whitelist :</label>
                        {sessionRole === 'SUPERADMIN' ? (
                          <label className="container-checkbox flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={data?.whitelist}
                              name="whitelist"
                              className="checkmark"
                              onChange={(e) =>
                                setWhiteListCheck(e.target.checked)
                              } // Assuming you have a state to handle the text
                            />
                            <span className="checkmark bg-gray-100"></span>
                          </label>
                        ) : (
                          ''
                        )}
                        <span className="mt-4">
                          {whiteListCheck ? 'Whitelist' : 'Bukan Whitelist'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <EditCamera
                  setChangePhotos={setChangePhotos}
                  setPhotosComplete={setPhotosComplete}
                  faceDescriptors={faceDescriptors}
                  setFaceDescriptors={setFaceDescriptors}
                />
              </div>
            </div>
            <div className={`my-3 flex justify-end gap-3`}>
              <button
                onClick={() => router.push('/users')}
                type="button"
                className="bg-red-700 text-white px-5 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-5 py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </form>
          <div className={`flex justify-start gap-3`}>
            <DeleteItem prop="users" data={data} />
          </div>
        </div>
      </AdminLayout>
    )
  )
}
