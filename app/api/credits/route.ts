import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { generateRandomString } from "@/lib/utils"

const tx: Record<
  string,
  {
    userId: number
    amount: number
    tx: string
  }
> = {}

export const getTx = () => tx

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const payments = await prisma.credit.findMany({
    where: {
      userId: session.user?.id
    },
  })

  return NextResponse.json(payments)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { amount } = await request.json()

  if (amount < Number(process.env.MIN_BUY_CREDIT_AMOUNT)) {
    return NextResponse.json(
      {
        message: `Amount should be greater than ${process.env.MIN_BUY_CREDIT_AMOUNT}`,
      },
      { status: 400 },
    )
  }

  const verifier = generateRandomString()

  try {
    const data = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": String(process.env.NOW_PAYMENTS_API_KEY),
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "usd",
        success_url: `${request.nextUrl.origin}/api/credits/success?verifier=${verifier}`
      }),
    })
      .then((res) => res.json())
      .catch((e) => console.log("error making coinbase charge:", e))

    tx[verifier] = {
      userId: session.user?.id,
      amount,
      tx: data.id,
    }

    return NextResponse.json({
      message: "Charge created",
      data,
    })
  } catch (e) {
    return NextResponse.json(
      {
        message: `Error making payment: ${e.message}`,
      },
      { status: 500 },
    )
  }
}
