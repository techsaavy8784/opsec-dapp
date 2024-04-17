import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const data = await prisma.tempClaim.findMany()

  if (data !== null && data.length !== 0)
    data.map(async (item: any) => {
      await prisma.claim.updateMany({
        data: {
          amount: { increment: item.amount },
        },
        where: {
          userId: item.userId,
        },
      })
    })

  return NextResponse.json("success", { status: 201 })
}
