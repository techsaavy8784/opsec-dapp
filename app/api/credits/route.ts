import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { generateRandomString } from "@/lib/utils"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const payments = await prisma.credit.findMany({
    where: {
      userId: session.user.id,
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

  if (amount < Number(process.env.NEXT_PUBLIC_MIN_BUY_CREDIT_AMOUNT)) {
    return NextResponse.json(
      {
        message: `Amount should be greater than ${process.env.NEXT_PUBLIC_MIN_BUY_CREDIT_AMOUNT}`,
      },
      { status: 400 },
    )
  }

  const verifier = generateRandomString()
  const successUrl = `${request.nextUrl.origin}/api/credits/success?verifier=${verifier}`

  //   console.log("success url: ", successUrl)

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
        pay_currency: "eth",
        success_url: successUrl,
      }),
    })
      .then((res) => res.json())
      .catch((e) => console.log("error making charge:", e))

    const payment = await fetch(
      "https://api.nowpayments.io/v1/invoice-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": String(process.env.NOW_PAYMENTS_API_KEY),
        },
        body: JSON.stringify({
          iid: data.id,
          pay_currency: "eth",
        }),
      },
    )
      .then((res) => res.json())
      .catch((e) => console.log("error making charge:", e))

    if (payment.statusCode !== undefined && payment.statusCode !== 200) {
      return NextResponse.json(payment, { status: payment.statusCode })
    }

    const { payment_id } = payment

    await prisma.txVerifier.create({
      data: {
        verifier,
        tx: {
          userId: session.user.id,
          amount,
          tx: payment_id,
        },
      },
    })

    return NextResponse.json({
      message: "Charge created",
      tx: payment_id,
      url: `${data.invoice_url}&paymentId=${payment_id}`,
    })
  } catch (e) {
    return NextResponse.json(
      {
        message: `Error making payment: ${e}`,
      },
      { status: 500 },
    )
  }
}
