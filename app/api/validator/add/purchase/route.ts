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

  const payments = await prisma.payment.findMany({
    where: {
      validatorId: validatorId,
    },
  })

  const totalAmountForValidator = payments.reduce(
    (total, item) => total + item.credit,
    0,
  )

  const updateValidator = await prisma.validator.update({
    where: {
      id: validatorId,
    },
    data: {
      purchaseTime:
        totalAmountForValidator + amount <
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
