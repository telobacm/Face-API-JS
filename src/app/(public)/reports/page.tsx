'use client'
import React, { useState } from 'react'
import Table from '../../../components/Table'

export default function Reports() {
  const [searchValue, setSearchValue] = useState('john')
  const [currentPage, setCurrentPage] = useState(1)
  const userList = [
    {
      name: 'John Doe',
      nip: 'NIP07390923097',
      unit: 'Sleman',
      intimestamp: '1710499460',
      outtimestamp: '1710499460',
      exspression: 'neutral',
      address: 'Gang Kurma, Planet Namek',
      gender: 'pria',
    },
    {
      name: 'Jane Doe',
      nip: 'NIP07390923097',
      unit: 'Bantul',
      intimestamp: '1710499460',
      outtimestamp: '1710499460',
      exspression: 'neutral',
      address: 'Gang Kurma, Planet Namek',
      gender: 'wanita',
    },
    {
      name: 'JSON Statham',
      nip: 'NIP07390923097',
      unit: 'Sleman',
      intimestamp: '1710499460',
      outtimestamp: '1710499460',
      exspression: 'neutral',
      address: 'Gang Kurma, Planet Namek',
      gender: 'pria',
    },
  ]

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
