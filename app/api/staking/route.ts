import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const payments = await prisma.payment.findMany({
    where: {
      node: {
        userId: session.user.id,
      },
      stakeId: {
        not: null,
      },
    },
    include: {
      node: {
        include: {
          blockchain: true,
        },
      },
    },
  })

  return NextResponse.json(payments)
}
