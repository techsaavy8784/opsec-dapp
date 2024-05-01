import dayjs from "dayjs"
import prisma from "@/prisma"
import getValidatorReward from "./getValidatorReward"

const getValidatorTotalReward = async (userId: number) => {
  const validators = await prisma.validator.findMany({
    where: { NOT: { purchaseTime: null } },
    include: { validatorType: true },
  })

  const reward = await prisma.reward.findFirst({
    where: { userId: userId },
  })

  const withdrawTime = reward && dayjs(reward.validatorRewardWithdrawTime)

  const rewardInfos = await Promise.all(
    validators.map(async (validator) =>
      getValidatorReward(userId, validator.id, withdrawTime),
    ),
  )

  const totalReward = rewardInfos.reduce((total, item) => total + item, 0)

  return totalReward
}

export default getValidatorTotalReward
