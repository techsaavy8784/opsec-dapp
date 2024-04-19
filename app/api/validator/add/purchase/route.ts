import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { validatorId, amount } = await request.json()

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  })

  const validator = await prisma.validator.findUnique({
    where: {
      id: validatorId,
    },
    include: {
      validatorType: true,
    },
  })

  const totalAmountForValidator = await prisma.payment.aggregate({
    where: {
      validatorId: validatorId,
    },
    _sum: {
      credit: true,
    },
  })

  const updateValidator = await prisma.validator.update({
    where: {
      id: validatorId,
    },
    data: {
      purchaseTime:
        Number(totalAmountForValidator._sum.credit ?? 0) + amount <
        Math.ceil(await getUSDAmountForETH(validator!.validatorType!.price))
          ? null
          : new Date(),
    },
  })

  const payment = await prisma.payment.create({
    data: {
      credit: amount,
      validatorId: validatorId,
      userId: session.user.id,
    },
  })

  await prisma.user.update({
    data: {
      balance: user!.balance - amount,
    },
    where: {
      id: session.user.id,
    },
  })

  return NextResponse.json({ status: 201 })
}
