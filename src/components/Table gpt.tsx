import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import debounce from 'debounce'
import NotFoundComponent from './NotFound'
import dayjs from 'dayjs' // Import dayjs for date formatting

const Table = ({
  searchValueProps,
  currentPageProps,
  handleAdd,
  finalColumnDef,
  showNotFound,
  data,
  title,
  showSearchBar,
  showExtraColumn,
}: any) => {
  const [searchValue, setSearchValue] = searchValueProps
  const [currentPage, setCurrentPage] = currentPageProps
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting]: any = useState([])

  // Conditionally adjust columns based on showExtraColumn prop
  const columns = useMemo(() => {
    // Clone finalColumnDef to avoid mutation
    let columnsClone = [...finalColumnDef]

    // Example: Conditionally add extra columns based on showExtraColumn prop
    if (showExtraColumn) {
      // Add Kampus column
      columnsClone.push({
        accessor: 'kampus',
        header: 'Kampus',
        cell: ({ row }: any) => <span>{row.original?.user?.kampus?.name}</span>,
      })

      // Add Unit column
      columnsClone.push({
        accessor: 'unit',
        header: 'Unit',
        cell: ({ row }: any) => <span>{row.original?.user?.unit?.name}</span>,
      })
    }

    return columnsClone
  }, [finalColumnDef, showExtraColumn])

  const tableInstance = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      sorting,
    },
    onSortingChange: setSorting,
    enableRowSelection: true,
  })

  return (
    <>
      <div className={`flex w-full gap-5 justify-between mt-5`}>
        {!!showSearchBar && (
          <div className={`w-1/2`}>
            <input
              name="search"
              type="search"
              defaultValue={searchValue}
              onChange={(e) => debounce(setSearchValue(e.target.value), 700)}
              placeholder={`Search ${title}`}
              className="bg-gray-100 h-min border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            />
          </div>
        )}

        {handleAdd && (
          <button onClick={handleAdd} className="!leading-normal !h-10">
            Add {title}
          </button>
        )}
      </div>

      {!!data?.length && (
        <div className="rounded-lg mt-7 shadow-lg">
          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-500 uppercase">
                {tableInstance.getHeaderGroups().map((headerEl: any) => (
                  <tr key={headerEl.id}>
                    {headerEl.headers.map((columnEl: any) => (
                      <th
                        key={columnEl.id}
                        onClick={columnEl.column.getToggleSortingHandler()}
                        className="text-left p-4"
                      >
                        {columnEl.isPlaceholder
                          ? null
                          : flexRender(
                              columnEl.column.header,
                              columnEl.getHeaderProps(),
                            )}
                        {columnEl.column.isSorted === 'asc'
                          ? '↑'
                          : columnEl.column.isSorted === 'desc'
                            ? '↓'
                            : ''}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableInstance.getRowModel().rows.map((rowEl: any) => (
                  <tr key={rowEl.id} className="hover:bg-gray-100">
                    {rowEl.getVisibleCells().map((cellEl: any) => (
                      <td key={cellEl.id} className="text-gray-900 p-4">
                        {flexRender(cellEl.value, cellEl.getCellProps())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TableFooter
            totalPages={data?.meta?.pageCount}
            totalData={data?.meta?.count}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {showNotFound && (
        <NotFoundComponent
          message={`Data ${title} Tidak Ditemukan`}
          className="p-7"
        />
      )}
    </>
  )
}

const TableFooter = ({
  totalPages,
  totalData,
  currentPage,
  setCurrentPage,
}: any) => {
  const handleChangePage = (page: number) => {
    setCurrentPage(page)
  }

  const handleNavigatePage = (type: string) => {
    let page = type === 'prev' ? currentPage - 1 : currentPage + 1
    setCurrentPage(page)
  }

  return (
    <nav
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500  space-x-2">
        Showing&nbsp;
        <span className="font-semibold text-gray-900 ">
          {currentPage}-{totalPages}
        </span>
        &nbsp;of
        <span className="font-semibold text-gray-900 ">{totalData}</span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => handleNavigatePage('prev')}
            className="disabled:cursor-not-allowed flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
          >
            prev
          </button>
        </li>
        {Array.from({ length: totalPages }).map((_, index) => (
          <li key={index}>
            <button
              onClick={() => handleChangePage(index + 1)}
              disabled={currentPage === index + 1}
              type="button"
              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                currentPage === index + 1
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-500'
              } border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handleNavigatePage('next')}
            className="disabled:cursor-not-allowed flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
          >
            next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Table
