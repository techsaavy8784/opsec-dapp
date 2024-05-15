import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function GET(req: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const url = req.nextUrl
    const wallet = url.searchParams.get("address")
    if (!wallet) {
      return NextResponse.json({ error: "No wallet provided" })
    }

    const user = await prisma.user.findFirstOrThrow({
      where: {
        address: wallet,
      },
      include: {
        nodes: {
          include: {
            server: true,
          },
        },
        credits: true,
      },
    })
    return NextResponse.json(user)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
