import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import {
  BiArchive,
  BiArrowBack,
  BiDesktop,
  BiLogOut,
  BiUserPlus,
} from 'react-icons/bi'
import {
  AiOutlineApartment,
  AiOutlineSetting,
  AiOutlineTeam,
} from 'react-icons/ai'

const adminMenus = [
  {
    group: 'Pages',
    items: [
      { icon: <BiArchive />, label: 'reports', href: '/reports' },
      { icon: <AiOutlineTeam />, label: 'users', href: '/users' },
      { icon: <BiUserPlus />, label: 'register', href: '/register' },
      { icon: <AiOutlineApartment />, label: 'units', href: '/units' },
      { icon: <BiDesktop />, label: 'devices', href: '/devices' },
    ],
  },
  {
    group: 'Account',
    items: [
      {
        icon: <AiOutlineSetting />,
        label: 'Account Settings',
        href: '/settings/',
      },
    ],
  },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

export default function SidebarAdmin({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const session: any = useSession()
  const role = session?.data?.user?.role
  const userId = session?.data?.user?.id
  if (role === 'USER') {
    adminMenus[0].items = [
      { icon: <BiArchive />, label: 'reports', href: `/reports/${userId}` },
    ]
  }
  if (role === 'ADMIN') {
    adminMenus[0].items = [
      { icon: <BiArchive />, label: 'reports', href: '/reports' },
      { icon: <AiOutlineTeam />, label: 'users', href: '/users' },
      { icon: <BiUserPlus />, label: 'register', href: '/register' },
    ]
  }

  const trigger = useRef<any>(null)
  const sidebar = useRef<any>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  useEffect(() => {
    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
    setSidebarExpanded(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
    )
  }, [])

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded')
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 border-r border-gray-200 py-6 z-50 flex h-screen w-64 flex-col justify-between overflow-y-auto bg-gradient-to-r to-[#ffffff] from-50% from-[#fffffc] text-black duration-300 ease-linear  lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        <div className="flex items-center justify-between md:justify-center gap-2 px-4 pb-8">
          {/* <Link href="/">
            <img src={'/logo.png'} alt="" className="h-10" />
          </Link> */}
          <h1 className="font-semibold">FaceApiJS</h1>
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden text-xl opacity-50"
          >
            <BiArrowBack />
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear ">
          <nav className="py-4 px-4 lg:px-6 space-y-9">
            {adminMenus.map(({ group, items }, idx) => (
              <div key={idx}>
                <h3 className="mb-4 ml-4  font-semibold opacity-50">{group}</h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {items.map((menu, i) => (
                    /* @ts-ignore */
                    <li key={i}>
                      <Link
                        href={`${menu.href}`}
                        className={`group capitalize relative flex !items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-blue-200 hover:bg-opacity-30  ${
                          pathname === `${menu.href}`
                            ? 'bg-sky-200 bg-opacity-50'
                            : ''
                        }`}
                        onClick={() => console.log(menu.href)}
                      >
                        <div className="text-xl">{menu.icon}</div>
                        <div className="mt-1"> {menu.label}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <button
        className="flex gap-3 items-center justify-center text-white  bg-red-700 font-bold w-min mx-auto py-3 px-5 rounded-xl whitespace-nowrap"
        onClick={() => signOut()}
      >
        <BiLogOut />
        Log out
      </button>
    </aside>
  )
}
