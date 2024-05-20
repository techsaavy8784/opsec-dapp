import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function GET(req: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const url = req.nextUrl
    const wallet = url.searchParams.get("address")
    if (!wallet) {
      return NextResponse.json({ error: "No wallet provided" }, { status: 400 })
    }

    const user: any = await prisma.user.findFirstOrThrow({
      where: {
        address: wallet,
      },
      include: {
        nodes: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            payments: {
              orderBy: {
                date: "desc",
              },
            },
          },
        },
        credits: {
          orderBy: {
            date: "desc",
          },
        },
      },
    })
    user?.nodes?.forEach((node: any) => {
      const remainingDuration = Math.max(
        0,
        node?.payments?.reduce(
          (sum: number, payment: any) => sum + payment.duration,
          0,
        ) -
          Math.round(
            (Date.now() - new Date(node.createdAt).getTime()) /
              (1000 * 3600 * 24),
          ),
      )
      const expiryDate = new Date(node.createdAt)
      expiryDate.setDate(expiryDate.getDate() + remainingDuration)
      node.expiryDate = expiryDate
    })
    return NextResponse.json(user)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
