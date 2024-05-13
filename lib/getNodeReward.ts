import dayjs from "dayjs"
import prisma from "@/prisma"
import { PAY_TYPE } from "@prisma/client"

const getNodeReward = async (userId: number, nodeId: number) => {
  const now = dayjs()

  const [paidCredit, node, withdrawTime] = await Promise.all([
    prisma.payment
      .aggregate({
        where: {
          userId,
          nodeId,
        },
        _sum: { credit: true },
      })
      .then((res) => res._sum.credit),

    prisma.node.findUnique({
      where: {
        id: nodeId,
        NOT: { server: null },
        blockchain: {
          payType: PAY_TYPE.PARTIAL,
        },
      },
      include: { blockchain: true },
    }),

    prisma.reward
      .findFirst({
        where: { userId },
      })
      .then((res) =>
        res?.nodeRewardWithdrawTime
          ? dayjs(res.nodeRewardWithdrawTime)
          : undefined,
      ),
  ])

  if (paidCredit === null || !node?.blockchain) {
    return { reward: 0, ownership: 0 }
  }

  const purchaseTime = dayjs(node.createdAt)

  const lockTime = purchaseTime.add(node.blockchain.rewardLockTime ?? 0, "day")

  const ownership = paidCredit / node.blockchain.price

  if (now.isBefore(lockTime)) {
    return { reward: 0, ownership }
  }

  if (now.isAfter(lockTime)) {
    let rewardPeriod = now.diff(purchaseTime, "month")

    if (withdrawTime) {
      rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
    }

    return {
      reward: (node.blockchain.rewardPerMonth ?? 0) * rewardPeriod * ownership,
      ownership,
    }
  }
}

export default getNodeReward
