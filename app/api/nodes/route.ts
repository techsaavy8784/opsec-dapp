import { authOptions } from "@/lib/auth"
import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  const servers = await prisma.server.findMany({
    where: {
      node: type === "available" ? { is: null } : { userId: session.user?.id },
    },
    include: {
      blockchain: true,
    },
  })

  return NextResponse.json(servers)
}
