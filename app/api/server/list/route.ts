import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const blockchainsWithServers = await prisma.blockchain.findMany({
    where: {
      servers: {
        some: {
          active: true,
          node: null,
        },
      },
    },
    select: {
      id: true,
      name: true,
      url: true,
      description: true,
      price: true,
    },
  })

  return NextResponse.json(blockchainsWithServers)
}
