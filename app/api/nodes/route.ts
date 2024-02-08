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

  const payments = await prisma.payment.findMany({
    where: {
      userId: session.user?.id,
    },
  })

  const boughtNodeIds = payments.map((node) => node.nodeId)

  const nodes = await prisma.node.findMany({
    where: {
      id: {
        in: type === "available" ? undefined : boughtNodeIds,
        notIn: type === "available" ? boughtNodeIds : undefined,
      },
    },
    include: {
      server: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  return NextResponse.json(nodes)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await request.json()

  const alreadyBought = await prisma.payment.findFirst({
    where: {
      userId: session.user?.id,
      nodeId: id,
    },
  })

  if (alreadyBought) {
    return NextResponse.json({ message: "Already bought" }, { status: 400 })
  }

  await prisma.payment.create({
    data: {
      userId: session.user?.id,
      nodeId: id,
    },
  })

  const node = await prisma.node.findFirst({
    where: {
      id,
    },
    include: {
      server: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  return NextResponse.json(node)
}
