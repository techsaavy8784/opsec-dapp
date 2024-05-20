import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"

export async function POST(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const distributorReceive = await prisma.distributorReceive.findFirst()

  await prisma.distributorReceive.upsert({
    where: { id: distributorReceive?.id ?? 0 },
    update: { receivedTime: new Date() },
    create: { receivedTime: new Date() },
  })

  return NextResponse.json({ status: 201 })
}
