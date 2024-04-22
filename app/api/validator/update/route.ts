import { NextResponse, NextRequest } from "next/server"
import checkRestAmount from "@/lib/checkRestAmount"

export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  checkRestAmount()

  return NextResponse.json({ status: 200 })
}
