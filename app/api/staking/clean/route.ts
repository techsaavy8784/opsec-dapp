import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"
import { Status } from "@prisma/client"

export async function POST(request: NextRequest) {
  const date = new Date(Date.now() - 10 * 60 * 1000)

  await prisma.rewardReserved.deleteMany({
    where: {
      createdAt: {
        lt: date,
      },
    },
  })

  await prisma.node.deleteMany({
    where: {
      status: Status.REWARD_RESERVED,
      createdAt: {
        lt: date,
      },
    },
  })

  return NextResponse.json("success", { status: 200 })
}
