'use client'
import React, { useState } from 'react'

const CharLimit = ({ text, max = 150, className }: any) => {
  const [showMore, setShowMore] = useState(false)

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  const displayText = showMore ? text : text.slice(0, max)

  return (
    <>
      <p className={`${className}`}>
        {/* {displayText}{' '} */}
        <span dangerouslySetInnerHTML={{ __html: displayText }}></span>
        <span>
          {text.length > max && (
            <button
              className="text-blue-500 hover:text-blue-700 cursor-pointer ml-0.5"
              onClick={toggleShowMore}
            >
              {showMore ? 'less' : '...more'}
            </button>
          )}
        </span>{' '}
      </p>
    </>
  )
}

export default CharLimit
