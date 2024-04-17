import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const claim = await prisma.claims.findMany()

  return NextResponse.json({ data: claim })
}