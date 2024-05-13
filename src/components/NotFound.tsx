import React from 'react'

export default function NotFoundComponent({
  className,
  title,
  message,
  image,
}: any) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className="w-[480px] flex flex-col items-center justify-center"
        style={{ backgroundImage: 'url("/images/background-pattern.png")' }}
      >
        <img
          alt="Image not found"
          src={image ? image : '/images/not-found.png'}
          className="h-28 w-36"
        />
        <div className="w-[352px] h-16 flex-col items-center gap-1.5 flex">
          <p className="text-center text-gray-900 text-base font-semibold  ">
            {title}
          </p>
          <p className="text-center text-slate-600 text-sm font-normal ">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
