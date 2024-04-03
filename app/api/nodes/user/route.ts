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
      server: {
        active: true,
      },
    },
    include: {
      payments: true,
      blockchain: {
        select: {
          id: true,
          name: true,
          url: true,
          description: true,
        },
      },
    },
  })

  return NextResponse.json(nodes)
}
