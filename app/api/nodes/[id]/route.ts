import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import dayjs from "dayjs"
import { PAY_TYPE } from "@prisma/client"
import getNodeReward from "@/lib/getNodeReward"

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

  const node = await prisma.node.findUniqueOrThrow({
    where: { id: nodeId },
    include: { payments: true, blockchain: true, server: true },
  })

  if (node.userId !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (!node.server || !node.blockchain.rewardWallet) {
    return NextResponse.json({
      ...node,
      reward: 0,
      ownership: 0,
    })
  }

  const withdrawTime = await prisma.reward
    .findFirst({
      where: { userId },
    })
    .then((res) =>
      res?.nodeRewardWithdrawTime
        ? dayjs(res.nodeRewardWithdrawTime)
        : undefined,
    )

  const paidCredit =
    node.blockchain.payType === PAY_TYPE.FULL
      ? node.blockchain.price
      : node.payments.find((payment) => payment.userId === userId)?.credit ?? 0

  const { reward, ownership } = getNodeReward(paidCredit, node, withdrawTime)

  return NextResponse.json({ ...node, reward, ownership })
}
