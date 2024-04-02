import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { stakeId, address } = await request.json()

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      address,
    },
  })

  await prisma.staking.create({
    data: {
      userId: user.id,
      stakeId,
    },
  })

  return NextResponse.json("success", { status: 201 })
}
