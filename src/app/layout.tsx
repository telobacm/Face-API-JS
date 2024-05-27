'use client'
import '~/styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Header from '~/components/header'
import Footer from '~/components/footer'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

// export const metadata: Metadata = {
//   title: 'FaceApiJS',
//   description: '',
// }
export const dynamic = 'force-dynamic'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children, session }: any) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/title-logo.svg" type="image/png" sizes="any" />
      </head>
      <body>
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
            <Hydrate>{children}</Hydrate>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
