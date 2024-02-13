import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { generateRandomString } from "@/lib/utils"

const tx: Record<
  string,
  {
    serverId: number
    userId: number
    duration: number
    wallet: string
    tx: string
  }
> = {}

export const getTx = () => tx

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { wallet, serverId, duration } = await request.json()

  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
    },
    include: {
      blockchain: true,
    },
  })

  if (!server) {
    return NextResponse.json({ message: "Server not exist" }, { status: 400 })
  }

  const alreadyBought = await prisma.node.findFirst({
    where: {
      userId: session.user?.id,
      serverId,
    },
  })

  if (alreadyBought) {
    return NextResponse.json({ message: "Already bought" }, { status: 400 })
  }

  const amount = server.blockchain.price * duration
  const verifier = generateRandomString()

  const { data } = await fetch("https://api.commerce.coinbase.com/charges/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CC-Api-Key": process.env.COINBASE_API_KEY as string,
    },
    body: JSON.stringify({
      name: "Node Payment",
      description: "Payment for node",
      local_price: {
        amount,
        currency: "USDT",
      },
      pricing_type: "fixed_price",
      redirect_url: `${request.nextUrl.origin}/api/payment/success?verifier=${verifier}`,
      cancel_url: `${request.nextUrl.origin}/api/payment/cancel`,
    }),
  })
    .then((res) => res.json())
    .catch((e) => console.log("error making coinbase charge:", e))

  if (!data) {
    return NextResponse.json(
      { message: "Error making payment" },
      { status: 500 },
    )
  }

  tx[verifier] = {
    serverId,
    duration,
    wallet,
    userId: session.user?.id,
    tx: data.id,
  }

  return NextResponse.json({
    message: "Charge created",
    data,
  })
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const tx = Number(url.searchParams.get("tx"))

  const { data } = await fetch(
    `https://api.commerce.coinbase.com/charges/${tx}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_API_KEY as string,
      },
    },
  ).then((res) => res.json())

  if (!data) {
    return NextResponse.json(
      { message: "Error fetching charge" },
      { status: 500 },
    )
  }

  if (data.timeline[0].status === "New") {
    return NextResponse.json(
      { message: "Payment not yet made", status: "New" },
      { status: 200 },
    )
  }

  if (data.timeline[0].status === "Signed") {
    return NextResponse.json(
      { message: "Payment signed", status: "Signed" },
      { status: 200 },
    )
  }

  if (data.timeline[0].status === "Pending") {
    return NextResponse.json(
      { message: "Payment pending", status: "Pending" },
      { status: 200 },
    )
  }

  return NextResponse.json(
    { message: "Payment completed", status: "Completed" },
    { status: 200 },
  )
}
