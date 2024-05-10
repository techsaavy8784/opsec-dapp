import prisma from "@/prisma"
import getValidatorReward from "./getValidatorReward"
import { PAY_TYPE } from "@prisma/client"

const getValidatorTotalReward = async (userId: number) => {
  const nodes = await prisma.node.findMany({
    include: { blockchain: true },
  })

  const validators = nodes.filter(
    (node) => node.blockchain.payType === PAY_TYPE.PARTIAL,
  )
  const rewardInfos = await Promise.all(
    validators.map((validator) => getValidatorReward(userId, validator.id)),
  )

  const totalReward = rewardInfos.reduce((total, item) => total + item, 0)

  return totalReward
}

export default getValidatorTotalReward
