import React, { Children } from 'react'

export default function Button({ children, className }: any) {
  return (
    <button
      className={`px-5 lg:px-10 py-2 lg:py-4 text-sm lg:text-[1.375rem] rounded-full border-2 border-red-700 items-center justify-center ${className}`}
    >
      {children}
    </button>
  )
}
