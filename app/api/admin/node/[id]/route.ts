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

  const node = await prisma.node.findUnique({
    where: { id: nodeId },
    include: { payments: true, blockchain: true },
  })

  let ownership = 0

  if (node?.blockchain.payType === PAY_TYPE.FULL) return NextResponse.json(0)

  const { _sum: paidCreditUSD } = await prisma.payment.aggregate({
    where: { nodeId: nodeId },
    _sum: { credit: true },
  })

  if (!node || !node.blockchain || !paidCreditUSD.credit)
    return NextResponse.json(ownership)

  ownership = Number(paidCreditUSD.credit) / Number(node.blockchain.price)

  return NextResponse.json(ownership)
}
