import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { publicClient } from "@/contract/client"
import abi from "@/contract/abi.json"
import { Status } from "@prisma/client"
import { formatUnits } from "viem"

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const staking = await prisma.staking.findFirstOrThrow()

  const [, stakingAmount, duration] = (await publicClient.readContract({
    abi,
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    functionName: "stakes",
    args: [staking.stakeId],
  })) as [string, bigint, bigint]

  const amount = Number(formatUnits(stakingAmount, 18))
  const durationInDays = Number(duration) / 3600 / 24
  const serverIds: number[] = []
  const blockchainIds: number[] = []

  await Promise.all(
    serverIds.map((serverId, key) =>
      prisma.node.create({
        data: {
          userId: staking.userId,
          serverId,
          blockchainId: blockchainIds[key],
          status: Status.CREATED,
          payments: {
            create: [
              {
                stakeId: staking.stakeId,
                duration: durationInDays,
                credit: amount,
              },
            ],
          },
        },
      }),
    ),
  )

  await prisma.staking.delete({
    where: {
      id: staking.id,
    },
  })

  return NextResponse.json("success", { status: 200 })
}
