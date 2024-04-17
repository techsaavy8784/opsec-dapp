import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { amount } = await request.json()
  let oldAmount = 0

  const data = await prisma.claim.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (data) {
    await prisma.claim.delete({
      where: {
        id: data.id,
      },
    })
    oldAmount = data.amount
  }
  await prisma.claim.create({
    data: {
      userId: session.user.id,
      address: session.user.address,
      lasted_at: new Date(),
      amount: oldAmount + amount,
    },
  })

  return NextResponse.json("success", { status: 201 })
}
