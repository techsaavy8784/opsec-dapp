import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getNodeTotalReward } from "@/lib/node-reward"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const [reward, nodeReward] = await Promise.all([
    prisma.reward.findFirst({
      where: { userId },
    }),
    getNodeTotalReward(userId),
  ])

  let totalReward = nodeReward

  if (reward) {
    totalReward += (reward.taxReward ?? 0) + (reward.reflectionReward ?? 0)
  }

  await prisma.reward.upsert({
    where: { id: reward?.id ?? 0 },
    update: {
      taxReward: 0,
      reflectionReward: 0,
      rewardWithdrawTime: new Date(),
    },
    create: {
      userId,
      rewardWithdrawTime: new Date(),
    },
  })

  const claim = await prisma.claim.findFirst({
    where: { userId },
  })

  await prisma.claim.upsert({
    where: { id: claim?.id ?? 0 },
    update: {
      amount: (claim?.amount ?? 0) + totalReward,
    },
    create: {
      userId,
      amount: totalReward,
    },
  })

  return NextResponse.json({ status: 201 })
}
