import dayjs, { Dayjs } from "dayjs"
import prisma from "@/prisma"

const getValidatorReward = async (
  userId: number,
  validatorId: number,
  now: Dayjs,
  withdrawTime?: Dayjs | null,
) => {
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

  if (!validator || !meCreditUSD._sum || !sumCreditUSD._sum) return rewardAmount

  const lockTime = dayjs(validator.purchaseTime).add(
    validator.validatorType.rewardLockTime,
    "day",
  )
  if (now.isAfter(lockTime)) {
    let rewardPeriod = now.diff(lockTime, "month")
    if (withdrawTime) rewardPeriod -= withdrawTime.diff(lockTime, "month")
    rewardAmount =
      validator.validatorType.rewardPerMonth *
      rewardPeriod *
      (Number(meCreditUSD._sum) / Number(sumCreditUSD._sum))
  }

  return rewardAmount
}

export default getValidatorReward
