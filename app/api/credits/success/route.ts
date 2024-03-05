import prisma from "@/prisma"
import { NextResponse, NextRequest } from "next/server"
import { JsonObject } from "@prisma/client/runtime/library"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const verifier = url.searchParams.get("verifier") as string

  const txInfo = await prisma.txVerifier.findFirst({
    where: {
      verifier,
    },
  })

  if (!txInfo) {
    return NextResponse.json({ message: "Charge not made" }, { status: 401 })
  }

  const { userId, amount, tx } = txInfo.tx as JsonObject

  const credits = Number(amount)

  await prisma.credit.create({
    data: {
      userId: Number(userId),
      credits,
      tx: String(tx),
    },
  })

  const user = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
  })

  await prisma.user.update({
    data: {
      balance: user!.balance + credits,
    },
    where: {
      id: Number(userId),
    },
  })

  await prisma.txVerifier.delete({
    where: {
      verifier,
    },
  })

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/billing`)
}
