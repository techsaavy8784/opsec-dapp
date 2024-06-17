import prisma from "@/prisma"
import { Status } from "@prisma/client"
import { SERVER_TYPE, PAY_TYPE } from "@prisma/client"

const availableServers = async (blockchainId: number) => {
  const blockchain = await prisma.blockchain.findUnique({
    where: {
      id: blockchainId,
    },
  })

  const whereCondition: any = {
    active: true,
    type:
      blockchain?.payType === PAY_TYPE.FULL
        ? SERVER_TYPE.MULTI_NODE
        : SERVER_TYPE.SINGLE_NODE,
  }

  if (blockchain?.payType === PAY_TYPE.FULL) {
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
  } else {
    whereCondition.nodes = {
      none: {},
    }
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
