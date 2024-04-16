import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { userId } = await request.json()

  const data = await prisma.claims.findUnique({
    where: {
      user_id: Number(userId),
    },
  })

  await prisma.tempClaim.create({
    data: {
      user_id: Number(userId),
      address: data.address,
      amount: data.amount,
    },
  })

  await prisma.claims.update({
    data: {
      amount: 0,
    },
    where: {
      user_id: Number(userId),
    },
  })

  return NextResponse.json("success", { status: 201 })
}
