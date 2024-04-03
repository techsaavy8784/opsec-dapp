import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const data = await prisma.claim.findFirst({
    where: {
      user_id: session.user.id,
    },
  })

  if (data)
    await prisma.claim.delete({
      where: {
        id: data.id,
      },
    })

  await prisma.claim.create({
    data: {
      user_id: session.user.id,
      address: session.user.address,
      lasted_at: new Date(),
    },
  })

  return NextResponse.json("success", { status: 201 })
}
