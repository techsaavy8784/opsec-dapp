import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { Status } from "@prisma/client"
import { publicClient } from "@/contract/client"
import abi from "@/contract/abi.json"

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
      stakeId: {
        not: null,
      },
    },
    include: {
      node: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  return NextResponse.json(payments)
}

// extend subscription
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id, stakeId } = await request.json()

  const node = await prisma.node.findUnique({
    where: {
      id,
    },
    include: {
      blockchain: true,
    },
  })

  if (!node) {
    return NextResponse.json("Node doesn't exist", { status: 404 })
  }

  const [, amount, duration] = (await publicClient.readContract({
    abi,
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    functionName: "stakes",
    args: [stakeId],
  })) as [string, number, number]

  const payment = await prisma.payment.create({
    data: {
      duration: Math.round(duration / 3600 / 24),
      credit: amount,
      nodeId: node.id,
    },
  })

  return NextResponse.json(payment, { status: 201 })
}

// buy node
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { wallet, id, plan, stakeId } = await request.json()

  const blockchainId = id

  const serverIds = await prisma.server.findMany({
    where: {
      NOT: [
        {
          nodes: {
            some: {
              blockchainId,
              status: {
                not: Status.EXPIRED,
              },
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

  if (serverIds.length === 0) {
    return NextResponse.json(
      { message: "No suitable server found" },
      { status: 404 },
    )
  }

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

  const [, amount, duration] = (await publicClient.readContract({
    abi,
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    functionName: "stakes",
    args: [stakeId],
  })) as [string, number, number]

  const node = await prisma.node.create({
    data: {
      wallet,
      serverId: serverIds[Math.floor(Math.random() * serverIds.length)].id,
      userId: session.user.id,
      blockchainId,
    },
  })

  const payment = await prisma.payment.create({
    data: {
      duration: Math.round(duration / 3600 / 24),
      credit: amount,
      stakeId,
      nodeId: node.id,
    },
  })

  return NextResponse.json(payment, { status: 201 })
}
