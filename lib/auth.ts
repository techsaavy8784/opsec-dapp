import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { isAddress } from "viem"
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        address: {
          label: "Email",
          type: "email",
          placeholder: "based@opsec.org",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        if (!credentials.address) {
          return null
        }

        if (!credentials.password) {
          if (isAddress(credentials.address as string)) {
            return {
              address: credentials.address,
            }
          }

          return null
        }

        const user = await prisma.user.findUnique({
          where: { address: credentials.address },
        })

        if (!user) {
          return null
        }

        const isPasswordMatch = await compare(
          credentials.password,
          user.password ?? "",
        )

        if (!isPasswordMatch) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.address,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.address
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: token.address as string,
      }

      return session
    },
  },
}
