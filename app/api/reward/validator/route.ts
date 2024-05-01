import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import getValidatorTotalReward from "@/lib/getValidatorTotalReward"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const totalReward = await getValidatorTotalReward(session.user.id)

  return NextResponse.json(totalReward)
}
