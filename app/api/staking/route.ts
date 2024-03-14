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

export async function POST(request: NextRequest) {
  if (request.headers.get("X-API-KEY") !== process.env.STAKE_WEBHOOK_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { stakeId } = await request.json()

  const staking = await prisma.staking.findUniqueOrThrow({
    where: {
      id: stakeId,
    },
  })

  if (staking.userId === null) {
    const [, stakingAmount, duration] = (await publicClient.readContract({
      abi,
      address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
      functionName: "stakes",
      args: [stakeId],
    })) as [string, number, number]

    await prisma.payment.create({
      data: {
        duration: Math.round(duration / 3600 / 24),
        credit: stakingAmount,
        nodeId: Number(staking.data),
        stakeId,
      },
    })
  } else {
    const data = staking.data as Record<string, number>

    for (const chainId in data) {
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

      const amount = data[chainId]

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

      const [, stakeAmount, duration] = (await publicClient.readContract({
        abi,
        address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
        functionName: "stakes",
        args: [stakeId],
      })) as [string, number, number]

      await prisma.node.createMany({
        data: Array(amount)
          .fill(0)
          .map((_, i) => ({
            serverId: serverIds[i].id,
            userId: staking.userId!,
            blockchainId,
            payments: {
              create: [
                {
                  duration: Math.round(duration / 3600 / 24),
                  credit: stakeAmount,
                  stakeId,
                },
              ],
            },
          })),
      })
    }
  }

  return NextResponse.json("success", { status: 201 })
}
