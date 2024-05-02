import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import getValidatorReward from "@/lib/getValidatorReward"

export async function GET(
  request: NextRequest,
  { params }: { params: { validatorId: number } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const rewardAmount = await getValidatorReward(
    session.user.id,
    params.validatorId,
  )

  return NextResponse.json(rewardAmount)
}
