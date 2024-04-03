import md5 from 'md5'
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '~/../prisma/client'

const authOptions: NextAuthOptions = {
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
          const user: any = await prisma.user.findUnique({
            where: { email },
          })
          if (email === user.email && password === user.password) {
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
    // maxAge: 24 * 60 * 60, // 24 hours
    maxAge: 60 * 60, // 1 hours
  },
  callbacks: {
    async session({ session, token }: any) {
      const user = await prisma.user.findUnique({
        where: { email: token.email || '' },
      })
      session.user = {
        ...session.user,
        name: user?.fullname,
        role: user?.role,
        id: user?.id,
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
