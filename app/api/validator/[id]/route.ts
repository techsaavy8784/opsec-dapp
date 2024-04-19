import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const ethUSDRatio = await getUSDAmountForETH(1)
  await checkRestAmount()
  let restAmount: number = 0,
    paiedSumAmount: number = 0,
    mePaiedAmount: number = 0

  const meCreditUSD = await prisma.payment.aggregate({
    where: {
      validatorId: Number(params.id),
      userId: session.user.id,
    },
    _sum: {
      credit: true,
    },
  })
  mePaiedAmount = Number(meCreditUSD._sum.credit ?? 0) / ethUSDRatio
  const data = await prisma.validator.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      validatorType: true,
    },
  })

  if (data?.purchaseTime === null) {
    const sumCreditUSD = await prisma.payment.aggregate({
      where: {
        validatorId: Number(params.id),
      },
      _sum: {
        credit: true,
      },
    })
    paiedSumAmount = Number(sumCreditUSD._sum.credit ?? 0) / ethUSDRatio
    restAmount = data!.validatorType.price - paiedSumAmount
  } else {
    paiedSumAmount = data!.validatorType.price
    restAmount = 0
  }

  return NextResponse.json({
    ...data,
    restAmount,
    paiedSumAmount,
    mePaiedAmount,
  })
}
