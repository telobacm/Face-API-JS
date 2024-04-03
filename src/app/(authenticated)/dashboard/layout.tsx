'use client'
import { useState } from 'react'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children, session }: any) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate>{children}</Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  )
}
