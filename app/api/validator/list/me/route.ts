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

  const ratio = await getUSDAmountForETH(1)
  await checkRestAmount()

  const data =
    Number(status) === 1
      ? await prisma.validator.findMany({
          where: {
            NOT: {
              purchaseTime: null,
            },
            userId: session.user.id,
          },
          include: {
            validatorType: true,
          },
        })
      : Number(status) === 2
        ? await prisma.validator.findMany({
            where: {
              purchaseTime: null,
              userId: session.user.id,
            },
            include: {
              validatorType: true,
            },
          })
        : await prisma.validator.findMany({
            where: {
              userId: session.user.id,
            },
            include: {
              validatorType: true,
            },
          })
  const sendingData = await Promise.all(
    data.map(async (item: any) => {
      if (item.purchaseTime === null) {
        const usersForThisValidator = await prisma.payment.findMany({
          where: {
            validatorId: item.id,
          },
        })
        const sumCreditUSD = usersForThisValidator.reduce(
          (total, item) => total + item.credit,
          0,
        )
        return {
          ...item,
          paiedSumAmount: sumCreditUSD / ratio,
          restAmount: item.validatorType.price - sumCreditUSD / ratio,
        }
      } else
        return {
          ...item,
          paiedSumAmount: item.validatorType.price,
          restAmount: 0,
        }
    }),
  )
  return NextResponse.json(sendingData)
}
