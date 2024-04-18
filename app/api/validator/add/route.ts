import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"
import availableServers from "../../payment/available-servers"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { typeId, amount } = await request.json()

  const servers = await availableServers(1)

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  })

  const validatorType = await prisma.validatorType.findFirst({
    where: {
      id: typeId,
    },
  })

  const validator = await prisma.validator.create({
    data: {
      serverId: servers[Math.floor(Math.random() * servers.length)].id,
      userId: session.user.id,
      typeId: typeId,
      purchaseTime:
        (await getUSDAmountForETH(validatorType!.price)) > amount
          ? null
          : new Date(),
    },
  })

  const payment = await prisma.payment.create({
    data: {
      credit: amount,
      validatorId: validator.id,
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

  return NextResponse.json({})
}
