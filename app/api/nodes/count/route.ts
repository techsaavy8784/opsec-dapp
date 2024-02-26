import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { NextRequest } from "next/server"
import getServerSession from "next-auth"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const nodes = await prisma.node.findMany({
    include: {
      server: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  const chains: number[] = []

  nodes.forEach((node) => {
    if (!chains.includes(node.server.blockchainId)) {
      chains.push(node.server.blockchainId)
    }
  })

  return NextResponse.json({
    count: nodes.length,
    chainCount: chains.length,
  })
}
