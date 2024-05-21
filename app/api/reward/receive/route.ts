import { NextResponse, NextRequest } from "next/server"
import { formatUnits } from "viem"
import prisma from "@/prisma"
import { publicClient } from "@/contract/client"
import getAllHoldersOpSecBalance from "@/lib/total-holders-balance"

export async function POST(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const taxBalance = await publicClient.getBalance({
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
  })
  const taxAmount = formatUnits(taxBalance, 18)

  const totalOpsec = await getAllHoldersOpSecBalance()

  await prisma.taxHistory.create({
    data: { amount: Number(taxAmount), totalOpsec, createdAt: new Date() },
  })

  return NextResponse.json({ status: 201 })
}
