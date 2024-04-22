import prisma from "@/prisma"
import { Status } from "@prisma/client"

const availableServers = async (blockchainId?: number) => {
  const whereCondition: any = {
    active: true,
  }

  // If blockchainId is specified, add the condition for nodes on that blockchain
  if (blockchainId !== undefined) {
    whereCondition.NOT = [
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
    ]
  }

  const serverIds = await prisma.server.findMany({
    where: whereCondition,
    include: {
      _count: {
        select: {
          nodes: true,
        },
      },
    },
  })

  return serverIds.filter(
    (server) => server._count.nodes < Number(process.env.NODE_COUNT_PER_SERVER),
  )
}

export default availableServers
