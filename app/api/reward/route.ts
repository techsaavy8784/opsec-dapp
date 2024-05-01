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

    await prisma.reward.update({
      where: { id: reward.id },
      data: { validatorRewardWithdrawTime: new Date() },
    })
  } else {
    await prisma.reward.create({
      data: {
        userId: session.user.id,
        validatorRewardWithdrawTime: new Date(),
      },
    })
  }

  const claim = await prisma.claim.findFirst({
    where: { userId: session.user.id },
  })

  if (claim) {
    await prisma.claim.update({
      where: { id: claim.id },
      data: { amount: claim.amount + totalReward },
    })
  } else {
    await prisma.claim.create({
      data: {
        userId: session.user.id,
        amount: totalReward,
      },
    })
  }

  return NextResponse.json({ status: 201 })
}
