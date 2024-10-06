'use client'
import React, { useEffect, useState } from 'react'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import debounce from 'debounce'
import Button from './button'

import RSelect from './RSelect'

import Loading from './loading'
import Pagination, { Page, SetPage } from './Pagination'
import { listResult } from '~/services/type'
import { BiPlus } from 'react-icons/bi'

interface Option {
  label: string
  value: string
}

interface TableProps<TData> {
  loading?: boolean
  searchValueProps: [string, React.Dispatch<React.SetStateAction<string>>]
  currentPageProps: [Page, SetPage]
  handleAdd?: () => void
  options?: Option[]
  // category: string;
  // setCategory: React.Dispatch<React.SetStateAction<string>>;
  columns: any[] // You might want to replace 'any' with the appropriate type from @tanstack/react-table
  data: listResult | undefined
  title: string
  onResetFilter?: () => void
  hidePagination?: boolean
  manualSorting?: boolean
  // handleImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // loadingImport?: boolean;
  [key: string]: any
}

const Table = <TData,>({
  loading,
  searchValueProps,
  currentPageProps,
  handleAdd,
  options,
  // setCategory,
  // category,
  columns,
  data,
  title,
  searchby,
  onResetFilter,
  hidePagination,
  manualSorting,
  // handleImport,
  // loadingImport,
  ...props
}: TableProps<TData>) => {
  const [searchValue, setSearchValue] = searchValueProps
  const [page, setPage] = currentPageProps
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const tableInstance = useReactTable<TData>({
    columns,
    data: data?.data || [],
    manualSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection: rowSelection,
      sorting: sorting,
    },
    initialState: {
      pagination: {
        pageSize: page.take || 10,
      },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  })

  useEffect(() => {
    if (page.current !== 1) {
      setPage({ ...page, current: 1 })
    }
    // eslint-disable-next-line
  }, [searchValue])

  const isOption = !!options
  const totalItems = data?.meta?.count || 0

  return (
    <div className="!min-w-full">
      <div className="p-4">
        <h5 className="text-gray-900 text-2xl font-semibold">{title}</h5>
        <div
          className={`flex ${
            isOption ? 'items-end' : ''
          } w-full gap-5 justify-between mt-5`}
        >
          <div
            className={`w-[60%] ${isOption ? 'grid md:flex items-end gap-2 ' : ''}`}
          >
            {!!searchby && <input
              name="search"
              type="search"
              defaultValue={searchValue}
              onChange={debounce(
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value),
                700,
              )}
              placeholder={`Search ${searchby}`}
              className="bg-gray-100 w-1/2 h-min border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-violet-400 focus:border-violet-400 block  p-2 "
            />}
            {!!loading && <Loading fullscreen={false}></Loading>}
          </div>
          <div className="flex gap-2">
            {handleAdd && (
              <Button
                onClick={handleAdd}
                withoutlineclamp="true"
                className="!leading-normal !h-10"
                icon={<BiPlus className="w-5 h-5 fill-white" />}
                variant="primary"
              >
                Add {title}
              </Button>
            )}
          </div>
        </div>
        {props?.additionalComponent}
      </div>

      <div className=" rounded-lg mt-5 shadow-lg">
        {/* table */}
        <div className=" overflow-x-auto ">
          <table className="w-full  ">
            <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-y border-gray-300 whitespace-nowrap ">
              {tableInstance.getHeaderGroups().map((headerEl) => {
                return (
                  <tr key={headerEl.id} className=" ">
                    {headerEl.headers.map((columnEl) => {
                      return (
                        <th
                          key={columnEl.id}
                          onClick={columnEl.column.getToggleSortingHandler()}
                          className="text-left p-4"
                        >
                          {columnEl.isPlaceholder
                            ? null
                            : flexRender(
                                columnEl.column.columnDef.header,
                                columnEl.getContext(),
                              )}
                          {columnEl.column.getIsSorted() === 'asc'
                            ? '↑'
                            : columnEl.column.getIsSorted() === 'desc'
                              ? '↓'
                              : null}
                        </th>
                      )
                    })}
                  </tr>
                )
              })}
            </thead>
            {!!data?.data?.length && (
              <tbody className="bg-white divide-y divide-gray-300">
                {tableInstance.getRowModel().rows.map((rowEl, rowIndex) => {
                  return (
                    <tr key={rowEl.id} 
                    className='hover:bg-gray-100'
                    // className={`${rowIndex % 2 === 1 ? 'bg-slate-50' : 'bg-white'} hover:bg-gray-100`}
                      >
                      {rowEl.getVisibleCells().map((cellEl) => {
                        return (
                          <td key={cellEl.id} className="text-gray-900 p-4">
                            {flexRender(
                              cellEl.column.columnDef.cell,
                              cellEl.getContext(),
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>
        {totalItems > 5 && (
          <Pagination
            loading={!!loading}
            totalItems={totalItems}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  )
}

export default Table
