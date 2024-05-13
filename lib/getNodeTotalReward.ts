import prisma from "@/prisma"
import dayjs from "dayjs"
import getNodeReward from "./getNodeReward"
import { PAY_TYPE } from "@prisma/client"

const getNodeTotalReward = async (userId: number) => {
  const nodes = await prisma.node.findMany({
    where: {
      NOT: { server: null },
    },
    include: { payments: true, blockchain: true },
  })

  const withdrawTime = await prisma.reward
    .findFirst({
      where: { userId },
    })
    .then((res) =>
      res?.nodeRewardWithdrawTime
        ? dayjs(res.nodeRewardWithdrawTime)
        : undefined,
    )

  const totalReward = nodes.reduce((total, node) => {
    if (!node.blockchain.rewardWallet) {
      return total
    }

    const paidCredit =
      node.blockchain.payType === PAY_TYPE.FULL
        ? node.blockchain.price
        : node.payments.find((payment) => payment.userId === userId)?.credit ??
          0

    const { reward } = getNodeReward(paidCredit, node, withdrawTime)

    return total + reward
  }, 0)

  return totalReward
}

export default getNodeTotalReward
