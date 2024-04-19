import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await prisma.claim.updateMany({
    data: {
      status: false,
    },
    where: {
      status: true,
    },
  })

  return NextResponse.json("success", { status: 201 })
}
