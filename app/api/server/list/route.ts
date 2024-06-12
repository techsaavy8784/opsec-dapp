import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { PAY_TYPE, Payment, SERVER_TYPE } from "@prisma/client"
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

  const multiNodeServerCount = servers.filter(
    (server) => server.type === SERVER_TYPE.MULTI_NODE,
  ).length

  const singleNodeServerCount = servers.filter(
    (server) => server.type === SERVER_TYPE.SINGLE_NODE,
  ).length

  const totalCapacity =
    multiNodeServerCount * Number(process.env.NODE_COUNT_PER_SERVER) +
    singleNodeServerCount

  const usedCapacity = servers.reduce(
    (acc, server) => acc + Math.min(server.nodes.length, Number(process.env.NODE_COUNT_PER_SERVER)),
    0,
  )

  const remainingCapacity = totalCapacity - usedCapacity

  const chainsAll = await prisma.blockchain.findMany({
    include: {
      Node: true
    }
  })

  const chains = chainsAll
    .map((chain) => {
      let disabled = false
      let maxPrice = chain.price
      // todo: need to handle the case of PAY_TYPE.PARTIAL

      if (chain.payType === PAY_TYPE.FULL) {
        const chainServers = servers.filter(
          (server) =>
            server.type === SERVER_TYPE.MULTI_NODE &&
            server.nodes.some((node) => node.blockchainId === chain.id),
        )
        disabled = chainServers.length >= multiNodeServerCount
      } else {
        prisma.payment.findMany({
          where: { node: {
            blockchainId: chain.id
          }, }
        }).then((res : any) => {
          const checkAllOwnerShip = res.every((item: Payment) => item.credit === chain.price)
          if(checkAllOwnerShip && chain.Node.length === chain.count)
            disabled = true
          else if(chain.Node.length === chain.count)
            maxPrice = chain.price - res.find((item: Payment) => item.credit !== chain.price).credit
        })
      }

      return {
        id: chain.id,
        name: chain.name,
        description: chain.description,
        price: chain.price,
        floorPrice: chain.floorPrice,
        hasWallet: chain.hasWallet,
        payType: chain.payType,
        disabled,
        count: chain.count,
        nodeCount: chain.Node.length,
        maxPrice
      }
    })
    .sort((a, b) => {
      if (a.disabled === b.disabled) {
        return 0
      }
      return a.disabled ? -1 : 1
    })

  return NextResponse.json({
    total: totalCapacity,
    capacity: remainingCapacity,
    chains,
  })
}
