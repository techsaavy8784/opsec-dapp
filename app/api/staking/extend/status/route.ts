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
  const prevDuration = Number(url.searchParams.get("prevDuration"))

  const count = await prisma.payment.count({
    where: {
      stakeId,
      duration: {
        gt: prevDuration,
      },
    },
  })

  return NextResponse.json({ extended: count > 0 })
}
