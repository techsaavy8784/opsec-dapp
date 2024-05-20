import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function POST(req: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { expiryDate, nodeId, status } = await req.json()

    const nodeFound = await prisma.node.findFirst({
      where: {
        id: nodeId,
      },
      include: {
        payments: {
          orderBy: {
            date: "desc",
          },
        },
      },
    })
    if (!nodeFound)
      return NextResponse.json({ message: "Node not found" }, { status: 400 })

    if (status)
      await prisma.node.update({
        data: {
          status,
        },
        where: {
          id: nodeId,
        },
      })

    if (expiryDate) {
      const remainingDuration = Math.max(
        0,
        nodeFound.payments.reduce(
          (sum: number, payment: any) => sum + payment.duration,
          0,
        ) -
          Math.round(
            (Date.now() - new Date(nodeFound.createdAt).getTime()) /
              (1000 * 3600 * 24),
          ),
      )
      const oldExpiryDate = new Date(nodeFound.createdAt)
      oldExpiryDate.setDate(oldExpiryDate.getDate() + remainingDuration)

      const timeDifference =
        new Date(expiryDate).getTime() - oldExpiryDate.getTime()
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
      const lastPayment = nodeFound.payments[nodeFound.payments.length - 1]

      if (lastPayment?.duration) {
        const newDuration = Math.max(
          lastPayment.duration,
          lastPayment.duration + daysDifference,
        )

        await prisma.payment.update({
          where: { id: lastPayment.id },
          data: { duration: newDuration },
        })
      }
    }
    return NextResponse.json("success", { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
