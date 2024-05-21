import { NextResponse, NextRequest } from "next/server"
import { formatUnits } from "viem"
import prisma from "@/prisma"
import { publicClient } from "@/contract/client"
import getAllHoldersOpsecBalance from "@/lib/total-holders-balance"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const [taxBalance, totalOpsec] = await Promise.all([
    publicClient.getBalance({
      address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    }),
    getAllHoldersOpsecBalance(),
  ])
  const taxAmount = formatUnits(taxBalance, 18)

  await prisma.taxHistory.create({
    data: { amount: Number(taxAmount), totalOpsec, createdAt: new Date() },
  })

  return NextResponse.json({ status: 201 })
}
