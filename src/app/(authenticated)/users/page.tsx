'use client'
import React, { useState } from 'react'
import Table from '../../../components/Table'
import { useGetList } from '~/services/dashboard'

export default function Users() {
  const [searchValue, setSearchValue] = useState('john')
  const [currentPage, setCurrentPage] = useState(1)
  const { data: userList } = useGetList('users')
  console.log('userList', userList)

  const columnDefWithCheckBox = () => [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'nip',
      header: 'NIP',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
    },
    {
      accessorKey: 'expression',
      header: 'Status',
    },
  ]
  return (
    <div className="px-5">
      <Table
        searchValueProps={[searchValue, setSearchValue]}
        currentPageProps={[currentPage, setCurrentPage]}
        finalColumnDef={columnDefWithCheckBox()}
        title={'Blog'}
        data={userList}
      />
    </div>
  )
}
