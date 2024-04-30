import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"
import getPriceETH from "@/lib/getPriceETH"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let restAmount: number = 0,
    paidSumAmount: number = 0,
    mepaidAmount: number = 0

  const ethUSDRatioPromise = getPriceETH()

  const meCreditPromise = prisma.payment.aggregate({
    where: {
      validatorId: Number(params.id),
      userId: session.user.id,
    },
    _sum: {
      credit: true,
    },
  })
  const dataPromise = prisma.validator.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      validatorType: true,
    },
  })

  const [ethUSDRatio, meCreditUSD, data] = await Promise.all([
    ethUSDRatioPromise,
    meCreditPromise,
    dataPromise,
  ])

  mepaidAmount = Number(meCreditUSD._sum.credit ?? 0) / ethUSDRatio

  if (data?.purchaseTime === null) {
    const sumCreditUSD = await prisma.payment.aggregate({
      where: {
        validatorId: Number(params.id),
      },
      _sum: {
        credit: true,
      },
    })
    paidSumAmount = Number(sumCreditUSD._sum.credit ?? 0) / ethUSDRatio
    restAmount = data!.validatorType.price - paidSumAmount
  } else {
    paidSumAmount = data!.validatorType.price
    restAmount = 0
  }

  return NextResponse.json({
    ...data,
    restAmount,
    paidSumAmount,
    mepaidAmount,
  })
}
