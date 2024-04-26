import dayjs from "dayjs"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import getValidatorReward from "@/lib/getValidatorReawrd"

export async function GET(
  request: NextRequest,
  { params }: { params: { validatorId: number } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const reward = await prisma.reward.findFirst({
    where: { userId: session.user.id },
  })

  const now = dayjs()
  const withdrawTime = reward
    ? dayjs(reward.validatorRewardWithdrawTime)
    : undefined

  const { rewardAmount } = await getValidatorReward(
    session.user.id,
    params.validatorId,
    now,
    withdrawTime,
  )

  return NextResponse.json({ rewardAmount })
}
