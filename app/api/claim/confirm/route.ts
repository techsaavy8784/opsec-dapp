import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // const { address } = await request.json()

  // await prisma.claim.updateMany({
  //   data: {
  //     amount: 0,
  //     status: false,
  //   },
  //   where: {
  //     address: address,
  //   },
  // })

  return NextResponse.json("success", { status: 201 })
}
