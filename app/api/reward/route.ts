import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import getValidatorTotalReward from "@/lib/getValidatorTotalReward"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const reward = await prisma.reward.findFirst({
    where: { userId: session.user.id },
  })

  const validatorReward = await getValidatorTotalReward(session.user.id)

  let totalReward = validatorReward

  if (reward) {
    totalReward += (reward.taxReward || 0) + (reward.reflectionReward || 0)
  }

  await prisma.reward.upsert({
    where: { id: reward?.id },
    update: {
      taxReward: 0,
      reflectionReward: 0,
      validatorRewardWithdrawTime: new Date(),
    },
    create: {
      userId: session.user.id,
      validatorRewardWithdrawTime: new Date(),
    },
  })

  const claim = await prisma.claim.findFirst({
    where: { userId: session.user.id },
  })

  await prisma.claim.upsert({
    where: { id: claim?.id },
    update: {
      amount: (claim?.amount || 0) + totalReward,
    },
    create: {
      userId: session.user.id,
      amount: totalReward,
    },
  })

  return NextResponse.json({ status: 201 })
}
