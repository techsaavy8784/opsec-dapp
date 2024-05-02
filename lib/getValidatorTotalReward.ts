import prisma from "@/prisma"
import getValidatorReward from "./getValidatorReward"

const getValidatorTotalReward = async (userId: number) => {
  const validators = await prisma.validator.findMany({
    where: { NOT: { purchaseTime: null } },
    include: { validatorType: true },
  })

  const rewardInfos = await Promise.all(
    validators.map((validator) => getValidatorReward(userId, validator.id)),
  )

  const totalReward = rewardInfos.reduce((total, item) => total + item, 0)

  return totalReward
}

export default getValidatorTotalReward
