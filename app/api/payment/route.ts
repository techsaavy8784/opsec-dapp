import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const payments = await prisma.payment.findMany({
    where: {
      node: {
        userId: session.user?.id
      },
    },
    include: {
      node: {
        include: {
          server: {
            include: {
              blockchain: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json(payments)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { wallet, blockchainId, duration } = await request.json()

  const server = await prisma.server.findFirst({
    where: {
      blockchainId,
      node: null,
    },
    include: {
      blockchain: true,
    },
  })

  if (!server) {
    return NextResponse.json({ message: "Server not exist" }, { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user?.id
    },
  })

  const amount = server.blockchain.price * duration

  if (amount > user!.balance) {
    return NextResponse.json(
      { message: "Insufficient credit balance" },
      { status: 400 },
    )
  }

  const node = await prisma.node.create({
    data: {
      wallet,
      serverId: server.id,
      userId: session.user?.id,
    },
  })

  const payment = await prisma.payment.create({
    data: {
      duration,
      credit: amount,
      nodeId: node.id,
    },
  })

  await prisma.user.update({
    data: {
      balance: user!.balance - amount,
    },
    where: {
      id: session.user?.id,
    },
  })

  return NextResponse.json(payment, { status: 201 })
}
