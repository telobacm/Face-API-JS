import React from 'react'

export default function FloatInput({
  id,
  name,
  label,
  labelClassName,
  textarea,
  className,
  ...props
}: any) {
  return (
    <div
      className={`relative flex flex-col max-w-sm md:max-w-none lg:max-w-none items-start ${className}`}
    >
      <div
        className={` relative w-full flex rounded-md justify-center items-center`}
      >
        {textarea ? (
          <textarea
            id={id || name}
            name={name || id}
            placeholder={' '}
            className={`block p-2.5 w-full text-gray-900 border border-gray-300 outline-0 focus:ring-gray-500 focus:border-gray-500 ${className}`}
            {...props}
          />
        ) : (
          <input
            id={id || name}
            name={name || id}
            className={`block p-2.5 w-full text-gray-900 border border-gray-300 outline-0 focus:ring-gray-500 focus:border-gray-500 peer ${className}`}
            placeholder={' '}
            {...props}
          />
        )}

        <label
          htmlFor={id || name}
          className={`absolute bg-white rounded peer-focus:text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${labelClassName}`}
        >
          {label}
        </label>
      </div>
    </div>
  )
}
