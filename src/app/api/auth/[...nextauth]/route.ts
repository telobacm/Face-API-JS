import md5 from 'md5'
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '~/../prisma/client'

export const dynamic = 'force-dynamic'
export const authOptions: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email:',
          type: 'text',
          placeholder: 'admin@example.com',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: '12345',
        },
      },
      async authorize({ email, password }: any) {
        try {
          const user: any = await prisma.users.findUnique({
            where: { email },
          })
          if (!!user.isDeleted) {
            throw new Error('Akun ini sudah tidak aktif.')
          } else if (email === user.email && password === user.password) {
            delete user.password
            return user
          } else {
            return null
          }
        } catch (error) {
          console.error('authorize', error)
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
    // maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async session({ session, token }: any) {
      const user = await prisma.users.findUnique({
        where: { email: token.email || '' },
      })

      const kampus = await prisma.kampus.findUnique({
        where: { id: user?.kampusId },
      })
      const unit = await prisma.unit.findUnique({
        where: { id: user?.unitId },
      })

      session.user = {
        ...session.user,
        name: user?.name,
        role: user?.role,
        nip: user?.nip,
        kampusId: user?.kampusId,
        kampusLabel: kampus?.name,
        unitId: user?.unitId,
        unitLabel: unit?.name,
        id: user?.id,
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
