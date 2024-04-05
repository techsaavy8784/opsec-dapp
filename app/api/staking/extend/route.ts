import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { publicClient } from "@/contract/client"
import abi from "@/contract/abi.json"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { stakeId } = await request.json()

  const [, , duration] = (await publicClient.readContract({
    abi,
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    functionName: "stakes",
    args: [stakeId],
  })) as [string, bigint, bigint]

  await prisma.payment.updateMany({
    data: {
      duration: Number(duration) / 3600 / 24,
    },
    where: {
      stakeId,
    },
  })

  return NextResponse.json("success", { status: 200 })
}
