import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import getTaxReward from "@/lib/tax-reward"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const taxReward = await getTaxReward(session.user.id, session.user.address)

  return NextResponse.json(taxReward)
}
