import prisma from "@/prisma"
import getValidatorReward from "./getValidatorReward"
import { PAY_TYPE } from "@prisma/client"

const getValidatorTotalReward = async (userId: number) => {
  const validators = await prisma.node.findMany({
    where: {
      NOT: { server: null },
      blockchain: {
        payType: PAY_TYPE.PARTIAL,
      },
    },
    include: { blockchain: true },
  })

  const rewardInfos = await Promise.all(
    validators.map((validator) => getValidatorReward(userId, validator.id)),
  )

  const totalReward = rewardInfos.reduce((total, item) => total + item, 0)

  return totalReward
}

export default getValidatorTotalReward
