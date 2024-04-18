import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const status = String(url.searchParams.get("status"))

  await checkRestAmount()

  const data =
    Number(status) === 1
      ? await prisma.validator.findMany({
          where: {
            NOT: {
              purchaseTime: null,
              userId: session.user.id,
            },
          },
          include: {
            validator_types: true,
          },
        })
      : Number(status) === 2
        ? await prisma.validator.findMany({
            where: {
              purchaseTime: null,
              NOT: {
                userId: session.user.id,
              },
            },
            include: {
              validator_types: true,
            },
          })
        : await prisma.validator.findMany({
            where: {
              userId: session.user.id,
              NOT: {
                userId: session.user.id,
              },
            },
            include: {
              validator_types: true,
            },
          })
  return NextResponse.json(data)
}
