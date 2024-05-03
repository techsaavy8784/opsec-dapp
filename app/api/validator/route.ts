import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import getPriceETH from "@/lib/getPriceETH"
import { ValidatorStatus } from "@/lib/constants"
import getValidatorReward from "@/lib/getValidatorReward"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const status = String(request.nextUrl.searchParams.get("status"))

  const [validators, ratio] = await Promise.all([
    prisma.validator.findMany({
      where:
        status === ValidatorStatus.RUNNING
          ? {
              NOT: {
                purchaseTime: null,
              },
            }
          : {
              purchaseTime: null,
            },
      include: {
        validatorType: true,
      },
    }),
    getPriceETH(),
  ])

  const userId = session.user.id

  const data = await Promise.all(
    validators.map(async (validator) => {
      const [meCreditUSD, sumCreditUSD] = await Promise.all([
        prisma.payment.aggregate({
          where: {
            validatorId: validator.id,
            userId,
          },
          _sum: {
            credit: true,
          },
        }),

        prisma.payment.aggregate({
          where: {
            validatorId: validator.id,
          },
          _sum: {
            credit: true,
          },
        }),
      ])

      const mepaidAmount = Number(meCreditUSD._sum.credit ?? 0) / ratio
      const sum = Number(sumCreditUSD._sum.credit ?? 0) / ratio

      if (validator.purchaseTime === null) {
        const restAmount = validator.validatorType.price - sum

        return {
          ...validator,
          mepaidAmount,
          ownership: Math.min(
            mepaidAmount / Math.max(validator.validatorType.price, sum),
            1,
          ),
          restAmount: Math.max(restAmount, 0),
          rewardAmount: 0,
        }
      } else {
        const rewardAmount = await getValidatorReward(
          session.user.id,
          validator.id,
        )
        return {
          ...validator,
          mepaidAmount,
          ownership: mepaidAmount / sum,
          restAmount: 0,
          rewardAmount,
        }
      }
    }),
  )

  return NextResponse.json(data)
}
