import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { getTx } from "../verify"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const verifier = url.searchParams.get("verifier") as string
  const txInfo = getTx()

  if (!txInfo[verifier]) {
    return NextResponse.json({ message: "Charge not made" }, { status: 401 })
  }

  const { userId, amount, tx } = txInfo[verifier]

  if (userId !== (session.user as any).id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const credits = Number(amount)

  await prisma.credit.create({
    data: {
      userId,
      tx,
      credits,
    },
  })

  const user = await prisma.user.findFirst({
    where: {
      id: (session.user as any).id,
    },
  })

  await prisma.user.update({
    data: {
      balance: user!.balance + credits,
    },
    where: {
      id: (session.user as any).id,
    },
  })

  delete txInfo[verifier]

  return NextResponse.json("Payment has been made successfully")
}
