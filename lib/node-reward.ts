import prisma from "@/prisma"
import { PAY_TYPE } from "@prisma/client"
import dayjs from "dayjs"
import { Blockchain, Node } from "@prisma/client"

export const getNodeTotalReward = async (userId: number) => {
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

const getNodeReward = (
  paidCredit: number,
  node: Node & { blockchain: Blockchain },
  withdrawTime?: dayjs.Dayjs,
) => {
  const now = dayjs()

  const purchaseTime = dayjs(node.createdAt)

  const lockTime = purchaseTime.add(node.blockchain.rewardLockTime ?? 0, "day")

  const ownership = paidCredit / node.blockchain.price

  if (now.isBefore(lockTime)) {
    return { reward: 0, ownership }
  }

  let rewardPeriod = now.diff(purchaseTime, "month")

  if (withdrawTime) {
    rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
  }

  return {
    reward: (node.blockchain.rewardPerMonth ?? 0) * rewardPeriod * ownership,
    ownership,
  }
}

export default getNodeReward
