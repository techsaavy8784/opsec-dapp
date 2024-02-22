import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { NextApiRequest } from "next"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const nodes = await prisma.node.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      server: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  return NextResponse.json(nodes)
}