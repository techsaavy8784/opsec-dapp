import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import dayjs from "dayjs"
import { PAY_TYPE } from "@prisma/client"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const nodeId = Number(params.id)
  const userId = session.user.id

  const node = await prisma.node.findUnique({
    where: { id: nodeId },
    include: { payments: true, blockchain: true, server: true },
  })

  if (node?.userId !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (node?.blockchain.payType === PAY_TYPE.FULL) {
    return NextResponse.json(node)
  }

  const {
    _sum: { credit: paidCredit },
  } = await prisma.payment.aggregate({
    where: { userId, nodeId },
    _sum: { credit: true },
  })

  const withdrawTime = await prisma.reward
    .findFirst({ where: { userId } })
    .then((res) =>
      res?.validatorRewardWithdrawTime
        ? dayjs(res.validatorRewardWithdrawTime)
        : undefined,
    )

  if (!node || !node.blockchain || !paidCredit) {
    return NextResponse.json({ ...node, reward: 0, ownership: 0 })
  }

  const now = dayjs()
  const purchaseTime = dayjs(node.createdAt)
  const lockTime = purchaseTime.add(node.blockchain.rewardLockTime || 0, "day")

  const ownership = paidCredit / node.blockchain.price
  let reward = 0

  if (now.isAfter(lockTime)) {
    let rewardPeriod = now.diff(purchaseTime, "month")

    if (withdrawTime) {
      rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
    }

    reward = (node.blockchain.rewardPerMonth || 0) * rewardPeriod * ownership
  }

  return NextResponse.json({ ...node, reward, ownership })
}
