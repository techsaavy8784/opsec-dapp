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

    const { userId, balance, balanceCredited } = await req.json()
    await prisma.credit.create({
      data: {
        userId: Number(userId),
        credits: balanceCredited,
        tx: "",
      },
    })

    await prisma.user.update({
      data: {
        balance: Number(balance) + Number(balanceCredited),
      },
      where: {
        id: Number(userId),
      },
    })

    return NextResponse.json("success", { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
