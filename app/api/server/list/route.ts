import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { PAY_TYPE } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const servers = await prisma.server.findMany({
    where: {
      active: true,
    },
    include: {
      nodes: true,
    },
  })

  for (const server of servers) {
    server.nodes = server.nodes.filter((node) => node.status !== "EXPIRED")
  }

  const totalCapacity =
    servers.length * Number(process.env.NODE_COUNT_PER_SERVER)
  const usedCapacity = servers.reduce(
    (acc, server) => acc + server.nodes.length,
    0,
  )

  const remainingCapacity = totalCapacity - usedCapacity

  const chainsAll = await prisma.blockchain.findMany()

  const chains = chainsAll.map((chain) => {
    const chainServers = servers.filter((server) =>
      server.nodes.some((node) => node.blockchainId === chain.id),
    )

    // disabled if all possible servers have a node of this type
    const disabled =
      chain.payType === PAY_TYPE.PARTIAL
        ? false
        : chainServers.length === servers.length

    return {
      id: chain.id,
      name: chain.name,
      description: chain.description,
      price: chain.price,
      floorPrice: chain.floorPrice,
      hasWallet: chain.hasWallet,
      payType: chain.payType,
      disabled,
    }
  })

  return NextResponse.json({
    total: totalCapacity,
    capacity: remainingCapacity,
    chains: chains,
  })
}
