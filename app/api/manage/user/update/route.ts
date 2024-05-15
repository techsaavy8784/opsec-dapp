import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function POST(req: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const {
      type,
      id,
      wallet,
      status,
      blockchainId,
      host,
      port,
      username,
      password,
      active,
      credits,
      date,
      tx,
    } = await req.json()
    if (type === "nodes") {
      await Promise.all([
        prisma.node.update({
          data: {
            status,
            wallet,
            blockchainId,
          },
          where: {
            id,
          },
        }),
        prisma.server.update({
          data: {
            host,
            port,
            username,
            password,
            active: active === "true",
          },
          where: {
            id,
          },
        }),
      ])
    } else if (type === "credits") {
      await prisma.credit.update({
        data: {
          tx,
          credits: Number(credits),
          date,
        },
        where: {
          id,
        },
      })
    }

    return NextResponse.json("success", { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
