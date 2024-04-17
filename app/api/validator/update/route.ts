import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const inactiveValidators = await prisma.validator.findMany({
    where: {
      purchaseTime: null,
    },
    include: {
      validator_types: true,
    },
  })

  inactiveValidators.map(async (item: any) => {
    const usersForThisValidator = await prisma.payment.findMany({
      where: {
        validatorId: item.id,
      },
    })
    const sumCreditUSD = usersForThisValidator.reduce(
      (total, item) => total + item.credit,
      0,
    )
    const sumCreditETH = sumCreditUSD
    if (sumCreditETH >= item.validator_types.price)
      await prisma.validator.update({
        data: {
          purchaseTime: new Date(),
        },
        where: {
          id: item.id,
        },
      })
  })
  return NextResponse.json({})
}
