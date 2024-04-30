import dayjs, { Dayjs } from "dayjs"
import prisma from "@/prisma"

const getValidatorReward = async (
  userId: number,
  validatorId: number,
  withdrawTime?: Dayjs | null,
) => {
  const now = dayjs()

  const meCreditUSD = await prisma.payment.aggregate({
    where: {
      userId: userId,
      validatorId: validatorId,
    },
    _sum: { credit: true },
  })
  const sumCreditUSD = await prisma.payment.aggregate({
    where: { validatorId: validatorId },
    _sum: { credit: true },
  })

  const validator = await prisma.validator.findUnique({
    where: { id: validatorId, NOT: { purchaseTime: null } },
    include: { validatorType: true },
  })

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
      (Number(meCreditUSD._sum) / Number(sumCreditUSD._sum))
  }

  return rewardAmount
}

export default getValidatorReward
