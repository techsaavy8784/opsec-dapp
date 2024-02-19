import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const url = request.nextUrl
  const tx = Number(url.searchParams.get("tx"))

  const data = await fetch(`https://api.nowpayments.io/v1/payment/${tx}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": String(process.env.NOW_PAYMENTS_API_KEY),
    },
  }).then((res) => res.json())

  if (data.statusCode === 404) {
    return NextResponse.json({ status: "NOT_FOUND" }, { status: 200 })
  }

  return NextResponse.json({ status: data.payment_status }, { status: 200 })
}
