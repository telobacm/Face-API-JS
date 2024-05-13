'use client'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const clock = dayjs(currentTime).format('HH:mm:ss')

  // console.log('clock', typeof currentTime.locale('id').format('HH:mm:ss'))

  return (
    <div className="text-center">
      <p className="text-7xl font-bold">{clock}</p>
      <p className="text-xl font-semibold">
        {/* {currentTime.locale('id').format('dddd, DD MMMM YYYY')} */}
      </p>
    </div>
  )
}

export default Clock
