'use client'
import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import EditModal from '~/app/(authenticated)/components/editModal'
import { usePatch } from '~/services/dashboard'

export default function EditUser({ data }: any) {
  const [showPass, setShowPass] = useState(false)
  const { mutateAsync: edit } = usePatch('users')

  const handleToggleShowPass = () => {
    setShowPass((prevShowPass: any) => !prevShowPass)
  }

  const handleSubmit = async (e: any) => {
    try {
      const { password, role, whitelist } = e.target

      const payload: any = {
        password: password.value,
        role: role.value,
        whitelist: whitelist.checked,
      }
      await edit({ id: data.id, payload })
    } catch (error) {
      console.log(error)
    }
  }
  // console.log('dataUser', data)

  return (
    <EditModal
      data={data}
      title="Edit User"
      showImage={false}
      handleSubmit={handleSubmit}
    >
      <div className="flex-auto grid gap-2">
        <div className="grid grid-cols-12">
          <div className="col-span-2">Name</div>
          <div className="col-span-10 font-medium">: {data?.name}</div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-2">Email</div>
          <div className="col-span-10 font-medium">: {data?.email}</div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-2">NIP</div>
          <div className="col-span-10 font-medium">: {data?.nip}</div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-2">Jabatan</div>
          <div className="col-span-10 font-medium">
            : {data?.position.charAt(0) + data?.position.slice(1).toLowerCase()}
          </div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-2">Kampus</div>
          <div className="col-span-10 font-medium">: {data?.kampus?.name}</div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-2">Unit</div>
          <div className="col-span-10 font-medium">: {data?.unit?.name}</div>
        </div>
        {!!data?.subunit?.name && (
          <div className="grid grid-cols-12">
            <div className="col-span-2">SubUnit</div>
            <div className="col-span-10 font-medium">
              : {data?.subunit?.name}
            </div>
          </div>
        )}
        <div className="grid grid-cols-12">
          <div className="col-span-2">Gender</div>
          <div className="col-span-10 font-medium">: {data?.gender}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <label className="text-black">Password :</label>
        <div className="relative">
          <input
            required
            name="password"
            type={showPass ? 'text' : 'password'}
            defaultValue={data.password}
            placeholder="Enter password"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <span className="text-2xl cursor-pointer opacity-75">
          {showPass ? (
            <AiOutlineEye onClick={handleToggleShowPass} />
          ) : (
            <AiOutlineEyeInvisible onClick={handleToggleShowPass} />
          )}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <label className="text-black">Role :</label>
        <div className="relative">
          <select
            required
            name="role"
            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            defaultValue={data.role}
          >
            <option value="" disabled selected hidden className="text-gray-400">
              Pilih Role
            </option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="mt-4 text-black">Whitelist :</label>
        <label className={`container-checkbox`}>
          <input
            type="checkbox"
            defaultChecked={data.whitelist}
            name="whitelist"
            className="checkmark"
          />
          <span className="checkmark bg-gray-100" />
        </label>
      </div>
    </EditModal>
  )
}
