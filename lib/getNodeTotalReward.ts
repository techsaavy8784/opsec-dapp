import prisma from "@/prisma"
import getNodeReward from "./getNodeReward"
import { PAY_TYPE } from "@prisma/client"

const getNodeTotalReward = async (userId: number) => {
  const nodes = await prisma.node.findMany({
    where: {
      NOT: { server: null },
      blockchain: {
        payType: PAY_TYPE.PARTIAL,
      },
    },
    include: { blockchain: true },
  })

  const rewardInfos = await Promise.all(
    nodes.map((node) => getNodeReward(userId, node.id)),
  )

  const totalReward = rewardInfos.reduce(
    (total, item) => total + item.reward,
    0,
  )

  return totalReward
}

export default getNodeTotalReward
