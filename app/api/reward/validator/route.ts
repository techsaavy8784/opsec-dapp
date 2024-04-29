import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import dayjs from "dayjs"
import getValidatorReward from "@/lib/getValidatorReward"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let validators = await prisma.validator.findMany({
    where: { NOT: { purchaseTime: null } },
    include: { validatorType: true },
  })

  const reward = await prisma.reward.findFirst({
    where: { userId: session.user.id },
  })

  const now = dayjs()
  const withdrawTime = reward && dayjs(reward.validatorRewardWithdrawTime)

  const rewardInfos = await Promise.all(
    validators.map(async (validator) =>
      getValidatorReward(session.user.id, validator.id, now, withdrawTime),
    ),
  )

  const totalReward = rewardInfos.reduce((total, item) => total + item, 0)

  validators = validators
    .map((validator, index) => ({
      ...validator,
      rewardAmount: rewardInfos[index],
    }))
    .filter((validator) => validator.rewardAmount > 0)

  return NextResponse.json({ totalReward, validators })
}
