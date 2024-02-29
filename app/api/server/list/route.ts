import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
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

  const totalCapacity = servers.length * 8
  const usedCapacity = servers.reduce(
    (acc, server) => acc + server.nodes.length,
    0,
  )
  console.log("totalCapacity", totalCapacity)
  console.log("usedCapacity", usedCapacity)
  const remainingCapacity = totalCapacity - usedCapacity

  const chainsAll = await prisma.blockchain.findMany()

  const chains = chainsAll.map((chain) => {
    const chainServers = servers.filter((server) =>
      server.nodes.some((node) => node.blockchainId === chain.id),
    )

    // disabled if all possible servers have a node of this type
    const disabled = chainServers.length === servers.length

    return {
      id: chain.id,
      name: chain.name,
      description: chain.description,
      price: chain.price,
      hasWallet: chain.hasWallet,
      disabled,
    }
  })

  return NextResponse.json({
    capacity: remainingCapacity,
    chains: chains,
  })
}
