import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { publicClient } from "@/contract/client"
import abi from "@/contract/abi.json"
import { PAY_TYPE, Status } from "@prisma/client"
import { formatUnits, erc20Abi } from "viem"
import { stakingRewardAmount } from "../../payment/subscriptions"
import { pickFromProbabilities } from "@/lib/utils"
import availableServers from "../../payment/available-servers"

export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const staking = await prisma.staking.findFirstOrThrow()

  const [user, stakingAmount, duration] = (await publicClient.readContract({
    abi,
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    functionName: "stakes",
    args: [staking.stakeId],
  })) as [string, bigint, bigint]

  const balance = await publicClient.readContract({
    abi: erc20Abi,
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: [user as `0x${string}`],
  })

  const blockchains = await prisma.blockchain.findMany({
    where: {
      staking: true,
      payType: PAY_TYPE.FULL
    },
  })
  const stakePercentage = Number(
    (stakingAmount * BigInt(100)) / (balance + stakingAmount),
  )

  let baseProbabilities = blockchains.map((c) => 1 / c.price)
  const baseSum = baseProbabilities.reduce((acc, cur) => acc + cur, 0)
  baseProbabilities = baseProbabilities.map((prob) => prob / baseSum)

  // Adjust probabilities based on stake percentage
  // Assuming a linear increase in the probability for more expensive nodes
  const adjustmentFactors = baseProbabilities.map(
    (_, index) =>
      1 + ((0.5 * index) / (blockchains.length - 1)) * stakePercentage,
  )
  const adjustedProbabilities = baseProbabilities.map(
    (prob, index) => prob * adjustmentFactors[index],
  )

  const amount = Number(formatUnits(stakingAmount, 18))
  const durationInDays = Number(duration) / 3600 / 24
  const rewardNodeCount = stakingRewardAmount(amount)
  const blockchainIds = Array(rewardNodeCount)
    .fill(0)
    .map(() => blockchains[pickFromProbabilities(adjustedProbabilities)].id)

  for (const blockchainId of blockchainIds) {
    const servers = await availableServers(blockchainId)

    if (servers.length === 0) {
      await prisma.node.deleteMany({
        where: {
          status: Status.FAILED,
          userId: staking.userId,
          payments: {
            some: {
              stakeId: staking.stakeId,
            },
          },
        },
      })

      return NextResponse.json(
        `No server to allocate blockchain ${blockchainId}`,
        { status: 500 },
      )
    }

    await prisma.node.create({
      data: {
        userId: staking.userId,
        serverId: servers[0].id,
        blockchainId,
        status: Status.FAILED,
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
    })
  }

  await prisma.staking.delete({
    where: {
      id: staking.id,
    },
  })

  await prisma.node.updateMany({
    data: {
      status: Status.CREATED,
    },
    where: {
      status: Status.FAILED,
      userId: staking.userId,
      payments: {
        some: {
          stakeId: staking.stakeId,
        },
      },
    },
  })

  return NextResponse.json("success", { status: 200 })
}
