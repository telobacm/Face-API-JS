import React from 'react'

export default function MediaWrapper({
  data,
  secondData,
  index,
  isHovered,
  alt = '',
  className,
  isDashboard = false,
  ...props
}: any) {
  return (
    <>
      {data?.includes('.webm') ||
      data?.includes('.mov') ||
      data?.includes('.mp4') ? (
        <video muted loop autoPlay playsInline className={className} {...props}>
          <source
            src={
              secondData
                ? isHovered === index
                  ? `/videos/${data}`
                  : `/videos/${secondData}`
                : '/videos/' + data
            }
            type="video/mp4"
          />
          <source
            src={
              secondData
                ? isHovered === index
                  ? `/videos/${data}`
                  : `/videos/${secondData}`
                : '/videos/' + data
            }
            type="video/webm"
          />
        </video>
      ) : (
        <img
          {...props}
          src={
            secondData
              ? isHovered === index
                ? `/images/${data}`
                : `/images/${secondData}`
              : data?.includes('.gif')
              ? `/videos/${data}`
              : `/images/${data}`
          }
          alt={alt}
          className={`${className} ${
            data?.includes('.svg') && isDashboard
              ? 'bg-primary'
              : 'bg-transparent'
          } ${className.includes('object') ? '' : 'object-fill'}`}
        />
      )}
    </>
  )
}
