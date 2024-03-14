import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id, chainAmounts, nodeId } = await request.json()

  await prisma.staking.create({
    data: {
      id,
      data: nodeId ?? JSON.parse(chainAmounts),
      userId: nodeId ?? session.user.id,
    },
  })

  return NextResponse.json("ok", { status: 201 })
}
