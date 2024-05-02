import dayjs from "dayjs"
import prisma from "@/prisma"

const getValidatorReward = async (userId: number, validatorId: number) => {
  const now = dayjs()

  const [meCreditUSD, sumCreditUSD, validator, withdrawTime] =
    await Promise.all([
      prisma.payment.aggregate({
        where: {
          userId,
          validatorId,
        },
        _sum: { credit: true },
      }),

      prisma.payment.aggregate({
        where: { validatorId },
        _sum: { credit: true },
      }),

      prisma.validator.findUnique({
        where: { id: validatorId, NOT: { purchaseTime: null } },
        include: { validatorType: true },
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

  const purchaseTime = dayjs(validator.purchaseTime)

  const lockTime = purchaseTime.add(
    validator.validatorType.rewardLockTime,
    "day",
  )

  if (now.isAfter(lockTime)) {
    let rewardPeriod = now.diff(purchaseTime, "month")

    if (withdrawTime) {
      rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
    }

    rewardAmount =
      validator.validatorType.rewardPerMonth *
      rewardPeriod *
      (Number(meCreditUSD._sum.credit) / Number(sumCreditUSD._sum.credit))
  }

  return rewardAmount
}

export default getValidatorReward
