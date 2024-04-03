'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'

const menus = [
  { label: 'Home', href: '/' },
  { label: 'Our Solution', href: '/our-solution' },
  { label: 'Careers', href: '/careers' },
  { label: 'About Us', href: '/about-us' },
]

export default function Header() {
  const [showMenus, setShowMenus] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <header className="sticky top-0 z-[99999] bg-gradient-to-r from-[#0C0C0C] from-60% to-[#232323] text-white">
      <div className="w-wrap flex justify-between items-center py-[13px] px-5 lg:py-5 lg:px-20">
        <Link href={'/'}>
          <img
            src="/logo.png"
            alt="logo"
            className="w-auto h-[28.29px] lg:h-[49px]"
          />
        </Link>

        <nav className="hidden lg:flex grow gap-7 justify-end ">
          {menus.map((v, i) => (
            <Link
              scroll={true}
              href={v.href}
              key={i}
              className={`${
                pathname === v.href
                  ? ' underline  decoration-red-800 '
                  : 'hover:underline hover:decoration-white'
              }  underline-offset-[10px] `}
            >
              {v.label}
            </Link>
          ))}
        </nav>
        <nav
          className={`lg:hidden fixed h-min  top-0 ${
            showMenus ? 'left-0' : 'left-24'
          } right-0 bottom-0`}
        >
          <div className="text-xl   py-[13px] px-5 lg:py-5 lg:px-20">
            <div className="h-[28.29px] lg:h-[49px] flex items-center justify-end">
              {!showMenus ? (
                <AiOutlineMenu onClick={() => setShowMenus(!showMenus)} />
              ) : (
                <AiOutlineClose
                  className="relative z-[90]"
                  onClick={() => setShowMenus(!showMenus)}
                />
              )}
            </div>
          </div>

          {showMenus && (
            <>
              <div
                data-aos="fade-left"
                className="absolute z-[70] top-0 right-0 left-0 w-screen h-screen bg-[#191919]"
                onClick={() => setShowMenus(!showMenus)}
              />
              <div
                data-aos="fade-left"
                onClick={() => setShowMenus(!showMenus)}
                className="absolute z-[80] top-20 right-0 left-0  w-screen flex flex-col"
              >
                {menus.map((v, i) => (
                  <Link
                    key={i}
                    href={v.href}
                    className={`w-full px-20  ${
                      pathname == v.href ? 'bg-[#880505] font-bold' : ''
                    } `}
                  >
                    <div
                      className={`py-5 text-[18px] text-center uppercase border-b border-[#3A3A3A]`}
                    >
                      {v.label}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
