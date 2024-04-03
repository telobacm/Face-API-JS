import React from 'react'
import Header from './header'
import Footer from './footer'

export default function AppLayout({ children, header, footer }: any) {
  return (
    <>
      <Header {...header} />
      {children}
      <Footer {...footer} />
    </>
  )
}
