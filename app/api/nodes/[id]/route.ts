import { authOptions } from "@/lib/auth"
import { protectServer } from "@/lib/utils"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const node = await prisma.node.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      server: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  if (node?.server) {
    node.server = protectServer(node.server) as any
  }

  return NextResponse.json(node)
}
