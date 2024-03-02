import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { NextRequest } from "next/server"
import getServerSession from "next-auth"
import { NextResponse } from "next/server"
import { Status } from "@prisma/client"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const nodes = await prisma.node.findMany({
    where: {
      status: {
        not: Status.EXPIRED,
      },
    },
  })

  const chains: number[] = []

  nodes.forEach((node) => {
    if (!chains.includes(node.blockchainId)) {
      chains.push(node.blockchainId)
    }
  })

  return NextResponse.json({
    count: nodes.length,
    chainCount: chains.length,
  })
}
