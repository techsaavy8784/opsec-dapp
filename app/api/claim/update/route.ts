import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { userId } = await request.json()
  await prisma.claim.update({
    data: {
      amount: 0,
    },
    where: {
      user_id: Number(userId),
    },
  })

  return NextResponse.json("success", { status: 201 })
}
