import dayjs from "dayjs"
import prisma from "@/prisma"

const getValidatorReward = async (userId: number, nodeId: number) => {
  const now = dayjs()

  const [meCreditUSD, sumCreditUSD, validator, withdrawTime] =
    await Promise.all([
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
        where: { id: nodeId, NOT: { server: null } },
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

  if (!validator || !meCreditUSD._sum || !sumCreditUSD._sum) {
    return rewardAmount
  }

  const purchaseTime = dayjs(validator.createdAt)

  const lockTime = purchaseTime.add(
    validator.blockchain.rewardLockTime ?? 0,
    "day",
  )

  if (now.isAfter(lockTime)) {
    let rewardPeriod = now.diff(purchaseTime, "month")

    if (withdrawTime) {
      rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
    }

    rewardAmount =
      validator.blockchain.rewardPerMonth ??
      0 *
        rewardPeriod *
        (Number(meCreditUSD._sum.credit) / Number(sumCreditUSD._sum.credit))
  }

  return rewardAmount
}

export default getValidatorReward
