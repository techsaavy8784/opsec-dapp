import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { Status } from "@prisma/client"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { stakeId, rewards: data } = await request.json()

  const rewards = data as Record<string, number>

  for (const chainId in rewards) {
    const blockchainId = Number(chainId)

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

    const amount = rewards[chainId]

    if (serverIds.length < amount) {
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

    await Promise.all(
      Array(amount)
        .fill(0)
        .map((_, i) =>
          prisma.node.create({
            data: {
              serverId: serverIds[i].id,
              userId: session.user.id,
              status: Status.REWARD_RESERVED,
              blockchainId,
              rewardReserved: {
                create: {
                  stakeId,
                },
              },
            },
          }),
        ),
    )
  }

  return NextResponse.json("success", { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { stakeId, nodeId } = await request.json()

  await prisma.rewardReserved.create({
    data: {
      nodeId,
      stakeId,
    },
  })

  return NextResponse.json("success", { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { stakeId } = await request.json()

  await prisma.node.deleteMany({
    where: {
      status: Status.REWARD_RESERVED,
      rewardReserved: {
        stakeId,
      },
    },
  })

  return NextResponse.json("success", { status: 200 })
}
