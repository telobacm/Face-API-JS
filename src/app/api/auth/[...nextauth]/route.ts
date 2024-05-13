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
          const user: any = await prisma.users.findUnique({
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
    // maxAge: 3 * 24 * 60 * 60, // 3 days
    maxAge: 60 * 60, // 1 hours
  },
  callbacks: {
    async session({ session, token }: any) {
      const user = await prisma.users.findUnique({
        where: { email: token.email || '' },
      })
      session.user = {
        ...session.user,
        name: user?.name,
        role: user?.role,
        nip: user?.nip,
        kampus: user?.kampus,
        unit: user?.unit,
        id: user?.id,
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// with nip
// import md5 from 'md5'
// import NextAuth from 'next-auth'
// import type { NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { prisma } from '~/../prisma/client'

// const authOptions: NextAuthOptions = {
//   providers: [
//     // GoogleProvider({
//     //   clientId: process.env.GOOGLE_CLIENT_ID,
//     //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     // }),
//     // GitHubProvider({
//     //   clientId: process.env.GITHUB_ID as string,
//     //   clientSecret: process.env.GITHUB_SECRET as string
//     // }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         nip: {
//           label: 'NIP:',
//           type: 'text',
//           placeholder: 'ABC123',
//         },
//         password: {
//           label: 'Password:',
//           type: 'password',
//           placeholder: '12345',
//         },
//       },
//       async authorize({ nip, password }: any) {
//         try {
//           const user: any = await prisma.users.findUnique({
//             where: { nip },
//           })
//           if (nip === user.nip && password === user.password) {
//             delete user.password
//             return user
//           } else {
//             return null
//           }
//         } catch (error) {
//           console.error('authorize', error)
//         }
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     // strategy: 'database',
//     maxAge: 3 * 24 * 60 * 60, // 3 days
//     // maxAge: 60 * 60, // 1 hour
//   },
//   callbacks: {
//     async session({ session, token }: any) {
//       // async session({ session, token, user }: any) {
//       console.log('57 session', session)
//       console.log('58 token', token)
//       const user = await prisma.users.findUnique({
//         where: { nip: token.nip || '' },
//       })

//       // const user = await prisma.users.findFirstOrThrow({
//       //   where: { nip: token.nip || '' },
//       // })

//       session.user = {
//         ...session.user,
//         name: user?.name,
//         role: user?.role,
//         nip: user?.nip,
//         id: user?.id,
//       }
//       return session
//     },
//   },
// }

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }
