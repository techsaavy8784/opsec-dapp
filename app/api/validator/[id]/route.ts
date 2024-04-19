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
    paiedSumAmount: number = 0

  const data = await prisma.validator.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      validatorType: true,
    },
  })

  if (data?.purchaseTime === null) {
    const usersForThisValidator = await prisma.payment.findMany({
      where: {
        validatorId: Number(params.id),
      },
    })
    const sumCreditUSD = usersForThisValidator.reduce(
      (total, item) => total + item.credit,
      0,
    )
    paiedSumAmount = sumCreditUSD / ethUSDRatio
    restAmount = data!.validatorType.price - paiedSumAmount
  } else {
    paiedSumAmount = data!.validatorType.price
    restAmount = 0
  }

  return NextResponse.json({
    ...data,
    restAmount,
    paiedSumAmount,
  })
}
