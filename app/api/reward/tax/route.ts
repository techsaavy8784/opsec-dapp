import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const reward = await prisma.reward.findFirst({
    where: { userId: session.user.id },
  })

  return NextResponse.json(reward?.taxReward || 0)
}
