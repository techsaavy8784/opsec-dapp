import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { compare } from "bcrypt"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { isAddress } from "viem"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/adminlogin",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
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

        if ("address" in credentials) {
          if (isAddress(credentials.address as string)) {
            return {
              address: credentials.address,
            }
          }

          return null
        }

        if (!credentials.email || !credentials.password) {
          return null
        }

        const user = await db.admin.findUnique({
          where: { email: credentials.email },
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
          id: user.id.toString(),
          email: user.email,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: token.email as string,
      }

      return session
    },
  },
}
