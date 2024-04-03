'use client'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/id' // Import modul bahasa Indonesia

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(dayjs())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center">
      <p className="text-7xl font-bold">
        {currentTime.locale('id').format('HH:mm:ss')}
      </p>
      <p className="text-xl font-semibold">
        {currentTime.locale('id').format('dddd, DD MMMM YYYY')}
      </p>
    </div>
  )
}

export default Clock
