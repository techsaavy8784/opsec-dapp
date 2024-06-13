import Nodes from "@/components/icons/nodes"
import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { PAY_TYPE, SERVER_TYPE, Status } from "@prisma/client"
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
      nodes: true
    }
  }).then(chains => Promise.all(chains.map(chain => {
    const data = {
      id: chain.id,
      name: chain.name,
      description: chain.description,
      price: chain.price,
      floorPrice: chain.floorPrice,
      hasWallet: chain.hasWallet,
      payType: chain.payType,
    }

    if (chain.payType === PAY_TYPE.FULL) {
      const chainServers = servers.filter(
        (server) =>
          server.type === SERVER_TYPE.MULTI_NODE &&
          server.nodes.some((node) => node.blockchainId === chain.id),
      )

      if (chain.count === null) {
        return {
          ...data,
          disabled: chainServers.length >= multiNodeServerCount
        }
      } else {
        return prisma.node.findMany({
          where: {
            blockchainId: chain.id,
            NOT: {
              status: Status.EXPIRED
            }
          },
          include: {
            payments: true
          },
        }).then(nodes => ({
          ...data,
          disabled: chainServers.length >= multiNodeServerCount || chain.count! <= nodes.length
        }))
      }
    } else {
      return prisma.node.findMany({
        where: {
          blockchainId: chain.id,
          NOT: {
            status: Status.EXPIRED
          }
        },
        include: {
          payments: true
        },
      }).then(nodes => {
        let priceLimit = chain.price
        let disabled = false

        if (chain.nodes.length === chain.count) {
          const node = nodes.find(node => {
            const creditSum = node.payments.reduce((total, payment) => total + payment.credit, 0)
            return creditSum < chain.price
          })

          if (node === undefined) {
            disabled = true
          } else {
            const creditSum = node.payments.reduce((total, payment) => total + payment.credit, 0)
            priceLimit = chain.price - creditSum
          }
        }

        return {
          ...data,
          disabled,
          priceLimit
        }
      })
    }
  })))

  const chains = chainsAll
    .sort((a, b) => {
      if (a.disabled === b.disabled) {
        return 0
      }
      return a.disabled ? 1 : -1
    })

  return NextResponse.json({
    total: totalCapacity,
    capacity: remainingCapacity,
    chains,
  })
}
