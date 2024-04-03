import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import {
  BiArrowBack,
  BiBookReader,
  BiBookmarkAlt,
  BiCategoryAlt,
  BiChevronDown,
  BiDonateHeart,
  BiImages,
  BiLogOut,
  BiShareAlt,
} from 'react-icons/bi'
import {
  AiOutlineSetting,
  AiOutlineTeam,
  AiOutlineComment,
} from 'react-icons/ai'
import { TfiLayoutMediaLeft } from 'react-icons/tfi'

import MenuGroup from './menuGroup'

const adminMenus = [
  {
    group: 'LANDING PAGES',
    items: [
      { icon: <BiBookReader />, label: 'content', href: '/' },

      { icon: <BiImages />, label: 'media', href: '/media/' },
      { icon: <BiShareAlt />, label: 'social', href: '/social/' },
      { icon: <AiOutlineComment />, label: 'comment', href: '/comment/' },
      { icon: <AiOutlineTeam />, label: 'team', href: '/team/' },
      // {
      //   icon: <TfiLayoutMediaLeft />,
      //   label: 'Frame (elfsight)',
      //   href: '/elfsight/',
      // },
    ],
  },
  {
    group: 'ACCOUNT',
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
  if (role === 'USER') {
    adminMenus[0].items = []
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
      className={`absolute left-0 top-0 py-6 z-50 flex h-screen w-64 flex-col justify-between overflow-y-auto bg-gradient-to-r to-[#232323] from-50% from-[#0C0C0C] text-white duration-300 ease-linear  lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        <div className="flex items-center justify-between md:justify-center gap-2 px-4 pb-8">
          <Link href="/">
            <img src={'/logo.png'} alt="" className="h-10" />
          </Link>

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
                  {items.map((menu, i) =>
                    /* @ts-ignore */
                    !menu?.subs ? (
                      <li key={i}>
                        <Link
                          href={`/dashboard${menu.href}`}
                          className={`group capitalize relative flex !items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-blue-200 hover:bg-opacity-30  ${
                            pathname + '/' === `/dashboard${menu.href}`
                              ? 'bg-blue-300 bg-opacity-25'
                              : ''
                          }`}
                        >
                          <div className="text-xl">{menu.icon}</div>
                          <div className="mt-1"> {menu.label}</div>
                        </Link>
                      </li>
                    ) : (
                      <MenuGroup
                        key={i}
                        activeCondition={
                          pathname === menu.href || pathname.includes(menu.href)
                        }
                      >
                        {(handleClick, open) => {
                          return (
                            <>
                              <button
                                className={`group capitalize relative flex w-full items-center justify-between gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:bg-blue-200 hover:bg-opacity-30 ${
                                  pathname.includes(menu.href)
                                    ? 'bg-blue-300 bg-opacity-25'
                                    : ''
                                } `}
                                onClick={(e) => {
                                  e.preventDefault()
                                  sidebarExpanded
                                    ? handleClick()
                                    : setSidebarExpanded(true)
                                }}
                              >
                                <div className="flex items-center gap-4 ">
                                  {menu.icon} {menu.label}
                                </div>
                                <BiChevronDown
                                  className={`${open ? 'rotate-180' : ''}`}
                                />
                              </button>
                              <div
                                className={`translate transform overflow-hidden ${
                                  !open && 'hidden'
                                }`}
                              >
                                <div className="mt-2 mb-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  {
                                    /* @ts-ignore */
                                    menu?.subs &&
                                      /* @ts-ignore */
                                      menu?.subs?.map((sub, i2) => (
                                        <Link
                                          key={i}
                                          href={
                                            '/dashboard' + menu.href + sub.href
                                          }
                                          className={`group capitalize relative flex items-center gap-2.5 rounded-md px-4  duration-300 ease-in-out hover:text-white  hover:font-bold hover:opacity-100 ${
                                            pathname + '/' ==
                                            '/dashboard' + menu.href + sub.href
                                              ? 'text-white opacity-100 font-bold'
                                              : 'opacity-50'
                                          } `}
                                        >
                                          {sub.label}
                                        </Link>
                                      ))
                                  }
                                </div>
                              </div>
                              {/* <!-- Dropdown Menu End --> */}
                            </>
                          )
                        }}
                      </MenuGroup>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <button
        className="flex gap-3 items-center justify-center text-white  bg-red-800 font-bold w-min mx-auto py-3 px-5 rounded-xl whitespace-nowrap"
        onClick={() => signOut()}
      >
        <BiLogOut />
        Log out
      </button>
    </aside>
  )
}
