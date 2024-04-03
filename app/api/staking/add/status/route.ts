import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const stakeId = String(url.searchParams.get("stakeId"))

  const count = await prisma.staking.count({
    where: {
      userId: session.user.id,
      stakeId,
    },
  })

  return NextResponse.json({ added: count > 0 })
}
