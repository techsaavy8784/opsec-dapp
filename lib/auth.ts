// import { NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { db } from './db'

// export const authOptions: NextAuthOptions = {
//     adapter: PrismaAdapter(db),
//     secret: process.env.NEXTAUTH_SECRET,
//     session: {
//         strategy: 'jwt',
//     },
//     pages: {
//         signIn: '/login',
//     },
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 address: { label: 'Address', type: 'text' }
//             },
//             async authorize(credentials, req) {
//                 if (!credentials || !credentials.address) {
//                     return null
//                 }

//                 const user = await db.user.findUnique({
//                     where: { address: credentials.address },
//                 })

//                 if (!user) {
//                     return null
//                 }
//                 const isAdmin = user.role === 1
//                 if (!isAdmin) {
//                     return null
//                 }

//                 return {
//                     id: user.id.toString(),
//                     address: user.address,
//                     role: user.role,
//                 }
//             },
//         }),
//     ],

//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id
//                 token.address = user.address
//                 token.role = user.role
//             }
//             return token
//         },
//         async session({ session, token }) {
//             session.user = {
//                 ...session.user,
//                 id: token.id as number,
//                 address: token.address as string,
//                 role: token.role as number,
//             }

//             return session
//         },
//     },
// }
