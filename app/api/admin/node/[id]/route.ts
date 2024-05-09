import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
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

  if (node?.blockchain.payType === PAY_TYPE.FULL) {
    return NextResponse.json(0)
  }

  const {
    _sum: { credit: paidCreditUSD },
  } = await prisma.payment.aggregate({
    where: { nodeId: nodeId },
    _sum: { credit: true },
  })

  if (!node?.blockchain || !paidCreditUSD) {
    return NextResponse.json(0)
  }

  const ownership = paidCreditUSD / node.blockchain.price

  return NextResponse.json(ownership)
}
