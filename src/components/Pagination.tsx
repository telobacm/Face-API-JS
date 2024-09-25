import React, { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import RSelect from './RSelect'
import Loading from './loading'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

export type Page = { current: number; take: number }
export type SetPage = React.Dispatch<React.SetStateAction<Page>>

type PaginationProps = {
  loading?: boolean
  totalItems: number
  page: Page
  setPage: SetPage
}

export const defaultPage = { current: 1, take: 10 }

const limitOptions = [
  { value: 5, label: 5 },
  { value: 10, label: 10 },
  { value: 20, label: 20 },
  { value: 30, label: 30 },
  { value: 40, label: 40 },
  { value: 50, label: 50 },
]

const Pagination: React.FC<PaginationProps> = ({
  loading,
  totalItems,
  page,
  setPage,
}) => {
  const onPageChange = useCallback(
    (value: number) => setPage({ ...page, current: value + 1 }),
    [page, setPage],
  )

  const onLimitChange = useCallback(
    (value: number) => setPage({ current: 1, take: value }),
    [setPage],
  )

  const itemsPerPage = page.take
  const currentPage = page.current - 1
  const pageCount = Math.ceil(totalItems / itemsPerPage)

  return (
    <div className={`relative flex justify-between items-center gap-10 py-2 px-4`}>
      <RSelect
        inputClassName="!h-11 !z-50"
        className="!z-50"
        placeholder="Show items"
        options={limitOptions}
        value={limitOptions.find((x) => x.value == itemsPerPage)}
        onChange={({ value }: any) => onLimitChange(value)}
        label={'menampilkan'}
        totalItems={totalItems}
        outline={true}
        creatable={false}
      />
      {!!loading && <Loading fullscreen={false}></Loading>}
      <ReactPaginate
        className={`flex items-center ${
          totalItems <= itemsPerPage ? 'hidden' : ' '
        }`}
        initialPage={currentPage}
        pageCount={pageCount}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => onPageChange(selected)}
        containerClassName="pagination"
        activeClassName="active"
        previousLabel=<BiChevronLeft/>
        nextLabel=<BiChevronRight/>
        breakLabel="..."
        breakClassName="mx-2"
        pageClassName="cursor-pointer text-gray-500 hover:text-black"
        pageLinkClassName="px-4 py-2 rounded-md"
        previousLinkClassName={`hidden lg:block px-4 py-2 rounded-md bg-slate-200 border mr-4 ${
          currentPage == 0 ? 'text-gray-300 cursor-not-allowed' : ''
        }`}
        nextLinkClassName={`hidden lg:block px-4 py-2 rounded-md bg-slate-200 border ml-4 ${
          currentPage >= pageCount - 1 ? 'text-gray-300 cursor-not-allowed' : ''
        }`}
        activeLinkClassName="bg-blue-500 text-white"
      />
    </div>
  )
}
export default Pagination
