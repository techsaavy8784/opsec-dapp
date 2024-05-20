import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getNodeTotalReward } from "@/lib/node-reward"
import getTaxReward from "@/lib/tax-reward"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const [reward, taxReward, nodeReward] = await Promise.all([
    prisma.reward.findFirst({
      where: { userId },
    }),
    getTaxReward(userId, session.user.address),
    getNodeTotalReward(userId),
  ])

  let totalReward = nodeReward + taxReward

  if (reward) {
    totalReward += reward.reflectionReward ?? 0
  }

  await prisma.reward.upsert({
    where: { id: reward?.id ?? 0 },
    update: {
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
