import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"
import getPriceETH from "@/lib/getPriceETH"
import { ValidatorNodeFilter } from "@/lib/constants"
import dayjs from "dayjs"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const status = String(url.searchParams.get("status"))

  await checkRestAmount()

  const ratio = await getPriceETH()

  let data =
    Number(status) === ValidatorNodeFilter.FULLY_PURCHASED_NODES ||
    Number(status) === ValidatorNodeFilter.CLAIM_NODES
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
      : Number(status) === ValidatorNodeFilter.PARTIALLY_PURCHASED_NODES
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
  if (Number(status) === ValidatorNodeFilter.CLAIM_NODES)
    data = data.filter((item: any) =>
      dayjs(item.purchaseTime)
        .add(item.validatorType.rewardLockTime, "day")
        .isBefore(dayjs()),
    )
  const now = dayjs()
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
          mepaidAmount: Number(meCreditUSD._sum.credit ?? 0) / ratio,
          paidSumAmount: Number(sumCreditUSD._sum.credit ?? 0) / ratio,
          restAmount:
            item.validatorType.price -
            Number(sumCreditUSD._sum.credit ?? 0) / ratio,
          claimed: false,
        }
      } else {
        const claims = await prisma.claim.findMany({
          where: { userId: session.user.id, validatorId: item.id },
        })
        const lockTime = dayjs(item.purchaseTime).add(
          item.validatorType.rewardLockTime,
          "day",
        )
        const diff = now.diff(lockTime, "month")
        const claim = claims.find(
          (claim) =>
            dayjs(claim.lasted_at).diff(lockTime, "month") === diff - 1,
        )
        return {
          ...item,
          mepaidAmount: Number(meCreditUSD._sum.credit ?? 0) / ratio,
          paidSumAmount: item.validatorType.price,
          restAmount: 0,
          claimed: claims && claims.length > 0,
          claim,
        }
      }
    }),
  )

  return NextResponse.json(sendingData)
}
