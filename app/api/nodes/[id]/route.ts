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

  const { reward, ownership } = await getNodeReward(userId, nodeId)

  return NextResponse.json({ ...node, reward, ownership })
}
