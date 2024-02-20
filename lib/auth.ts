import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/error",
  },
  providers: [
    // SIWE (Sign-In
    CredentialsProvider({
      id: "ethereum",
      name: "Ethereum",
      credentials: {
        address: {
          label: "Ethereum Address",
          type: "text",
          placeholder: "0x",
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.address) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: { address: credentials.address },
        })

        if (!user) {
          return null
        }

        // For demo purposes, returning a mock user object
        return {
          id: credentials.address,
          address: credentials.address,
        }
      },
    }),

    // Username/Password
    CredentialsProvider({
      id: "admin",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        })

        if (!user) {
          return null
        }

        const isPasswordMatch = await compare(
          credentials.password,
          user.password,
        )
        if (!isPasswordMatch) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.address = user.address

        if (user.balance !== undefined) {
          token.balance = user.balance
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        address: token.address,
        balance: token.balance,
      }
      return session
    },
  },
}
