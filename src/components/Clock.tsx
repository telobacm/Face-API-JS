'use client'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const clock = dayjs(currentTime).format('HH:mm:ss')
  const date = dayjs(currentTime).format('dddd, DD MMMM YYYY')

  return (
    <div className="text-center">
      <p className="text-xl font-semibold">{date}</p>
      <p className="text-7xl font-bold">{clock}</p>
    </div>
  )
}

export default Clock
