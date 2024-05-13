import dayjs from "dayjs"
import prisma from "@/prisma"
import { PAY_TYPE } from "@prisma/client"

const getValidatorReward = async (userId: number, nodeId: number) => {
  const now = dayjs()

  const [paidCredit, paidCreditSum, node, withdrawTime] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        userId,
        nodeId,
      },
      _sum: { credit: true },
    }),

    prisma.payment.aggregate({
      where: { nodeId },
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
        res?.validatorRewardWithdrawTime
          ? dayjs(res.validatorRewardWithdrawTime)
          : undefined,
      ),
  ])

  let rewardAmount = 0

  if (!node || !paidCredit._sum || !paidCreditSum._sum) {
    return rewardAmount
  }

  const purchaseTime = dayjs(node.createdAt)

  const lockTime = purchaseTime.add(node.blockchain.rewardLockTime ?? 0, "day")

  if (now.isAfter(lockTime)) {
    let rewardPeriod = now.diff(purchaseTime, "month")

    if (withdrawTime) {
      rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
    }

    rewardAmount =
      (node.blockchain.rewardPerMonth ?? 0) *
      rewardPeriod *
      (Number(paidCredit._sum.credit) / Number(paidCreditSum._sum.credit))
  }

  return rewardAmount
}

export default getValidatorReward
