import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { getTx } from "../route"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const verifier = url.searchParams.get("verifier") as string
  const txInfo = getTx()

  if (!txInfo[verifier]) {
    return NextResponse.json({ message: "Charge not made" }, { status: 401 })
  }

  const { duration, serverId, userId, wallet, tx } = txInfo[verifier]

  if (userId !== session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const alreadyBought = await prisma.node.findFirst({
    where: {
      userId: session.user?.id,
      serverId,
    },
  })

  if (alreadyBought) {
    return NextResponse.json({ message: "Already bought" }, { status: 400 })
  }

  const payment = await prisma.payment.create({
    data: {
      duration,
      tx,
    },
  })

  await prisma.node.create({
    data: {
      wallet,
      serverId,
      userId: session.user?.id,
      paymentId: payment.id,
      isLive: true,
    },
  })

  delete txInfo[verifier]

  return NextResponse.json("Payment has been made successfully")
}
