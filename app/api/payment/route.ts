import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import subscriptions from "./subscriptions"
import availableServers from "./available-servers"
import { PAY_TYPE, Status } from "@prisma/client"

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

  const { id, plan } = await request.json()
  const userId = session.user.id

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

  if (node.blockchain.payType === PAY_TYPE.PARTIAL) {
    return NextResponse.json("Partial Node can not extend", { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  const [months, priceMultiplier] = subscriptions[plan]
  const amount = node.blockchain.price * priceMultiplier

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
      id: userId,
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
  const userId = session.user.id
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
      id: userId,
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

  if (blockchain.payType === PAY_TYPE.FULL) {
    [months, priceMultiplier] = subscriptions[plan]
    amount = blockchain.price * priceMultiplier
  } else {
    amount = Number(payAmount)
    months = 0

    if ((blockchain.floorPrice ?? 0) > amount) {
      return NextResponse.json(
        { message: "Too small payAmount" },
        { status: 400 },
      )
    }
  }

  if (amount > user!.balance) {
    return NextResponse.json(
      { message: "Insufficient credit balance" },
      { status: 400 },
    )
  }

  if (blockchain.payType === PAY_TYPE.PARTIAL) {
    const nodes = await prisma.node.findMany({
      where: { blockchainId: blockchain.id, NOT: { status: Status.EXPIRED } },
      include: { payments: true },
    })

    const node = nodes.find(
      (node) =>
        blockchain.price >
        node.payments.reduce((total, payment) => total + payment.credit, 0),
    )

    if (node) {
      const paidCredit = node.payments.reduce(
        (total, payment) => total + payment.credit,
        0,
      )
      const remain = blockchain.price - paidCredit
      let payment
      if (amount > remain && nodes.length < (blockchain.count || 0) - 1) {
        const newNode = await prisma.node.create({
          data: {
            wallet,
            userId,
            blockchainId,
            serverId: null,
          },
        })
        payment = await prisma.payment.createMany({
          data: [
            {
              duration: 0,
              credit: remain,
              nodeId: node.id,
              userId,
            },
            {
              duration: 0,
              credit: amount - remain,
              nodeId: newNode.id,
              userId,
            },
          ],
        })
      } else {
        payment = await prisma.payment.create({
          data: {
            duration: 0,
            credit: amount,
            nodeId: node.id,
            userId,
          },
        })
      }

      await prisma.user.update({
        data: { balance: user!.balance - amount },
        where: { id: userId },
      })

      return NextResponse.json(payment, { status: 201 })
    }
  }

  const node = await prisma.node.create({
    data: {
      wallet,
      userId,
      blockchainId,
      serverId:
        blockchain.payType === PAY_TYPE.FULL
          ? servers[Math.floor(Math.random() * servers.length)].id
          : null,
    },
  })

  const payment = await prisma.payment.create({
    data: {
      duration: months * 31,
      credit: amount,
      nodeId: node.id,
      userId,
    },
  })

  await prisma.user.update({
    data: { balance: user!.balance - amount },
    where: { id: userId },
  })

  return NextResponse.json(payment, { status: 201 })
}
