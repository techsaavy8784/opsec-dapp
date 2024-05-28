import { DefaultSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { SiweMessage } from "siwe"
import prisma from "@/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/manage/login",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      id: "admin",
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
        if (!credentials?.email) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: { address: credentials.email, role: "ADMIN" },
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
    CredentialsProvider({
      id: "credentials",
      credentials: {
        message: { type: "string" },
        signature: { type: "string" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        const { message, signature } = credentials
        const msg = JSON.parse(message)
        const { address } = msg
        const siweMessage = new SiweMessage(msg)
        const { success } = await siweMessage.verify({ signature })

        if (!success) {
          return null
        }

        await prisma.user.upsert({
          where: {
            address,
          },
          create: {
            address,
          },
          update: {
            address,
          },
        })

        const user = await prisma.user.findFirst({
          where: { address },
        })

        return {
          id: Number(user?.id) as unknown as string,
          address,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.address = (user as any).address
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: Number(token.id),
        address: token.address as string,
      }

      return session
    },
  },
}
