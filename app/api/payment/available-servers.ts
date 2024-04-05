import prisma from "@/prisma"
import { Status } from "@prisma/client"

const availableServers = async (blockchainId: number) => {
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
