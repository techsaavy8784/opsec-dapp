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

        const user = await prisma.user.findFirst({
          where: { address: credentials.address },
        })

        if (!user) {
          return null
        }

        if (!credentials.password) {
          if (!isAddress(credentials.address as string)) {
            return null
          }

          await prisma.user.upsert({
            where: {
              address: credentials.address,
            },
            create: {
              address: credentials.address,
            },
            update: {
              address: credentials.address,
            },
          })

          return user
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
        token.address = user.address
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        address: token.address as string,
      }

      return session
    },
  },
}
