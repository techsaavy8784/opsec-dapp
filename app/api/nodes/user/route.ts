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
      server: {
        active: true,
      },
      AND: {
        OR: [
          { userId: session.user.id },
          {
            payments: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
    },
    include: {
      payments: true,
      blockchain: true,
    },
  })

  return NextResponse.json(nodes)
}
