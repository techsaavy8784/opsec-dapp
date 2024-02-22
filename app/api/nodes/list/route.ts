import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const nodes = await prisma.node.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      server: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  return NextResponse.json(nodes)
}
