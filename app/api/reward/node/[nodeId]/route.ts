import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import getNodeReward from "@/lib/getNodeReward"

export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: number } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const rewardAmount = await getNodeReward(session.user.id, params.nodeId)

  return NextResponse.json(rewardAmount)
}
