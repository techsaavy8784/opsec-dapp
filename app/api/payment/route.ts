import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const payments = await prisma.payment.findMany({
    where: {
      node: {
        userId: session.user.id,
      },
    },
    include: {
      node: {
        include: {
          server: true,
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

  const serverIds = await prisma.server.findMany({
    where: {
      NOT: [
        {
          nodes: {
            some: {
              blockchainId: blockchainId,
            },
          },
        },
      ],
      active: true,
    },
    select: {
      id: true,
    },
  })

  const shuffledServerIds = shuffleArray(serverIds.map((server) => server.id))

  const serverId = shuffledServerIds.length > 0 ? shuffledServerIds[0] : null

  if (!serverId) {
    return NextResponse.json(
      { message: "No suitable server found" },
      { status: 404 },
    )
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  })

  const blockchain = await prisma.blockchain.findUnique({
    where: {
      id: blockchainId,
    },
  })

  if (!blockchain) {
    return NextResponse.json(
      { message: "Blockchain not found" },
      { status: 404 },
    )
  }

  const amount = blockchain.price * duration

  if (amount > user!.balance) {
    return NextResponse.json(
      { message: "Insufficient credit balance" },
      { status: 400 },
    )
  }

  const node = await prisma.node.create({
    data: {
      wallet,
      serverId: serverId,
      userId: session.user.id,
      blockchainId: blockchainId,
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
      id: session.user.id,
    },
  })

  return NextResponse.json(payment, { status: 201 })
}
