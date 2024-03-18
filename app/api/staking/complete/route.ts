import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { publicClient } from "@/contract/client"
import abi from "@/contract/abi.json"
import { Status } from "@prisma/client"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { stakeId } = await request.json()

  const [, stakingAmount, duration] = (await publicClient.readContract({
    abi,
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    functionName: "stakes",
    args: [stakeId],
  })) as [string, number, number]

  await prisma.node.updateMany({
    data: {
      status: Status.CREATED,
    },
    where: {
      status: Status.REWARD_RESERVED,
      rewardReserved: {
        stakeId,
      },
    },
  })

  const rewardReserved = await prisma.rewardReserved.findMany({
    where: {
      stakeId,
    },
  })

  await prisma.payment.createMany({
    data: rewardReserved.map((r) => ({
      nodeId: r.nodeId,
      stakeId,
      duration,
      credit: stakingAmount,
    })),
  })

  await prisma.rewardReserved.deleteMany({
    where: {
      stakeId,
    },
  })

  return NextResponse.json("success", { status: 200 })
}
