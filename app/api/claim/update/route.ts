import prisma from "@/prisma"
import { Claim } from "@prisma/client"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { userId } = await request.json()

  const data: Claim | null = await prisma.claim.findFirst({
    where: {
      userId: Number(userId),
    },
  })

  if (data !== null) {
    await prisma.claim.update({
      data: {
        status: true,
      },
      where: {
        id: data.id,
      },
    })
  }

  return NextResponse.json("success", { status: 201 })
}
