import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"
import getPriceETH from "@/lib/getPriceETH"
import { ValidatorNodeFilter } from "@/lib/constants"
import dayjs from "dayjs"
import getValidatorReward from "@/lib/getValidatorReward"

const getValidatorsWithReward = async (userId: number) => {
  let validators = await prisma.validator.findMany({
    where: { NOT: { purchaseTime: null } },
    include: { validatorType: true },
  })

  const reward = await prisma.reward.findFirst({ where: { userId } })

  const withdrawTime = reward && dayjs(reward.validatorRewardWithdrawTime)

  const rewardInfos = await Promise.all(
    validators.map(async (validator) =>
      getValidatorReward(userId, validator.id, withdrawTime),
    ),
  )

  const totalReward = rewardInfos.reduce((total, item) => total + item, 0)

  validators = validators
    .map((validator, index) => ({
      ...validator,
      rewardAmount: rewardInfos[index],
    }))
    .filter((validator) => validator.rewardAmount > 0)

  return NextResponse.json({ totalReward, validators })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const status = String(url.searchParams.get("status"))

  if (Number(status) === ValidatorNodeFilter.CLAIM_NODES) {
    const result = await getValidatorsWithReward(session.user.id)
    return NextResponse.json(result)
  }

  await checkRestAmount()

  const ratio = await getPriceETH()

  const data =
    Number(status) === ValidatorNodeFilter.FULLY_PURCHASED_NODES
      ? await prisma.validator.findMany({
          where: {
            NOT: {
              purchaseTime: null,
            },
          },
          include: {
            validatorType: true,
          },
        })
      : Number(status) === ValidatorNodeFilter.PARTIALLY_PURCHASED_NODES
        ? await prisma.validator.findMany({
            where: {
              purchaseTime: null,
            },
            include: {
              validatorType: true,
            },
          })
        : await prisma.validator.findMany({
            include: {
              validatorType: true,
            },
          })

  const sendingData = await Promise.all(
    data.map(async (item: any) => {
      const meCreditUSD = await prisma.payment.aggregate({
        where: {
          validatorId: item.id,
          userId: session.user.id,
        },
        _sum: {
          credit: true,
        },
      })
      if (item.purchaseTime === null) {
        const sumCreditUSD = await prisma.payment.aggregate({
          where: {
            validatorId: item.id,
          },
          _sum: {
            credit: true,
          },
        })

        return {
          ...item,
          mepaidAmount: Number(meCreditUSD._sum.credit ?? 0) / ratio,
          paidSumAmount: Number(sumCreditUSD._sum.credit ?? 0) / ratio,
          restAmount:
            item.validatorType.price -
            Number(sumCreditUSD._sum.credit ?? 0) / ratio,
        }
      } else {
        return {
          ...item,
          mepaidAmount: Number(meCreditUSD._sum.credit ?? 0) / ratio,
          paidSumAmount: item.validatorType.price,
          restAmount: 0,
        }
      }
    }),
  )

  return NextResponse.json(sendingData)
}
