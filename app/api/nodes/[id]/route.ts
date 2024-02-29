import { authOptions } from "@/lib/auth"
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
      payments: true,
      blockchain: true,
    },
  })

  if (node?.userId !== session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(node)
}
