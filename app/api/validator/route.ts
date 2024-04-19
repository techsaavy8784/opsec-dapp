import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const status = String(url.searchParams.get("status"))

  await checkRestAmount()

  const ratio = await getUSDAmountForETH(1)

  const data =
    Number(status) === 1
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
      : Number(status) === 2
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
          mePaiedAmount: Number(sumCreditUSD._sum.credit ?? 0) / ratio,
          paiedSumAmount: Number(sumCreditUSD._sum.credit ?? 0) / ratio,
          restAmount:
            item.validatorType.price -
            Number(sumCreditUSD._sum.credit ?? 0) / ratio,
        }
      } else
        return {
          ...item,
          mePaiedAmount: Number(meCreditUSD._sum.credit ?? 0) / ratio,
          paiedSumAmount: item.validatorType.price,
          restAmount: 0,
        }
    }),
  )

  return NextResponse.json(sendingData)
}
