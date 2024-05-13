import dayjs from "dayjs"
import prisma from "@/prisma"
import { PAY_TYPE } from "@prisma/client"

const getNodeReward = async (userId: number, nodeId: number) => {
  const now = dayjs()

  const [paidCredit, node, withdrawTime] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        userId,
        nodeId,
      },
      _sum: { credit: true },
    }),

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

  let rewardAmount = 0

  if (!node || !paidCredit._sum || !node.blockchain) {
    return { reward: rewardAmount, ownership: 0 }
  }

  const purchaseTime = dayjs(node.createdAt)

  const lockTime = purchaseTime.add(node.blockchain.rewardLockTime ?? 0, "day")

  const ownership = Number(paidCredit._sum.credit) / node.blockchain.price

  if (now.isAfter(lockTime)) {
    let rewardPeriod = now.diff(purchaseTime, "month")

    if (withdrawTime) {
      rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
    }

    rewardAmount =
      (node.blockchain.rewardPerMonth ?? 0) * rewardPeriod * ownership
  }

  return { reward: rewardAmount, ownership: ownership }
}

export default getNodeReward
