import { useEffect, useRef, useState } from 'react'
import { AiOutlineSetting } from 'react-icons/ai'
import Link from 'next/link'
import { BiChevronDown, BiLogOut } from 'react-icons/bi'

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const trigger = useRef<any>(null)
  const dropdown = useRef<any>(null)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <div className="relative ">
      <div
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Thomas Anree
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={'/images/teacher.svg'} alt="User" />
        </span>
        <BiChevronDown
          className={`hidden sm:block text-xl ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default w-min  ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 ">
          <li>
            <Link
              href="/dashboard/settings"
              className="py-3 flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base whitespace-nowrap"
            >
              <AiOutlineSetting />
              Account Settings
            </Link>
          </li>
        </ul>
        <button className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
          <BiLogOut />
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  )
}

export default DropdownUser
