import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { Status } from "@prisma/client"
import subscriptions from "./subscriptions"
import availableServers from "./available-servers"

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
      stakeId: null,
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

  const { id, plan, payAmount } = await request.json()

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

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  })

  let months, priceMultiplier, amount

  if (payAmount === undefined) {
    ;[months, priceMultiplier] = subscriptions[plan]
    amount = node.blockchain.price * priceMultiplier
  } else {
    amount = Number(payAmount)
    months = 0
  }

  if (amount > user!.balance) {
    return NextResponse.json(
      { message: "Insufficient credit balance" },
      { status: 400 },
    )
  }

  const payment = await prisma.payment.create({
    data: {
      duration: months * 31,
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

// buy node
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { wallet, id, plan, payAmount } = await request.json()

  const blockchainId = id

  const servers = await availableServers(blockchainId)

  if (servers.length === 0) {
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
  let months, priceMultiplier, amount

  if (payAmount === undefined) {
    ;[months, priceMultiplier] = subscriptions[plan]
    amount = blockchain.price * priceMultiplier
  } else {
    amount = Number(payAmount)
    months = 0
  }

  if (amount > user!.balance) {
    return NextResponse.json(
      { message: "Insufficient credit balance" },
      { status: 400 },
    )
  }

  const node = await prisma.node.create({
    data: {
      wallet,
      serverId:
        payAmount === undefined
          ? servers[Math.floor(Math.random() * servers.length)].id
          : null,
      userId: session.user.id,
      blockchainId,
    },
  })

  const payment = await prisma.payment.create({
    data: {
      duration: months * 31,
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
