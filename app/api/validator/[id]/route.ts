import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await checkRestAmount()

  const data = await prisma.validator.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      validator_types: true,
    },
  })

  return NextResponse.json(data)
}
