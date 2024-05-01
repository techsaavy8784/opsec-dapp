import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma"
import getPriceETH from "@/lib/getPriceETH"
import availableServers from "@/app/api/payment/available-servers"

export async function POST(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const [inactiveValidators, ethUSDRatio, servers] = await Promise.all([
    prisma.validator.findMany({
      where: {
        purchaseTime: null,
      },
      include: {
        validatorType: true,
      },
    }),
    getPriceETH(),
    availableServers(),
  ])

  for (const item of inactiveValidators) {
    const creditSumUsd = await prisma.payment.aggregate({
      where: {
        validatorId: item.id,
      },
      _sum: {
        credit: true,
      },
    })

    const creditSumEth = Number(creditSumUsd._sum.credit ?? 0) / ethUSDRatio

    if (creditSumEth >= item.validatorType.price) {
      const server = servers.pop()

      if (!server) {
        return NextResponse.json(
          { message: "Servers unavailable for validators" },
          { status: 500 },
        )
      }

      await prisma.validator.update({
        data: {
          purchaseTime: new Date(),
          serverId: server.id,
        },
        where: {
          id: item.id,
        },
      })
    }
  }

  return NextResponse.json({ status: 200 })
}
