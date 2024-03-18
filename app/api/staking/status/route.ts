import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const stakeId = String(url.searchParams.get("stakeId"))

  const count = await prisma.rewardReserved.count({
    where: {
      stakeId,
    },
  })

  return NextResponse.json({ complete: count === 0 })
}
