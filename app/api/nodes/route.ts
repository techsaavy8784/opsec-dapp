import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  const servers = await prisma.server.findMany({
    where: {
      node: type === "available" ? null : { userId: session.user?.id },
    },
    include: {
      blockchain: true,
    },
  })

  return NextResponse.json(servers)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { wallet, serverId } = await request.json()

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
      tx: "dummy",
    },
  })

  const node = await prisma.node.create({
    data: {
      wallet,
      serverId,
      userId: session.user?.id,
      paymentId: payment.id,
    },
  })

  const server = await prisma.server.findFirst({
    where: {
      node: {
        id: node.id,
      },
    },
    include: {
      blockchain: true,
    },
  })

  return NextResponse.json(server)
}
