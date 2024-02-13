import prisma from "@/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

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
        currency: "ETH",
      },
      pricing_type: "fixed_price",
      redirect_url: `${request.nextUrl.origin}/api/payment/success`,
      cancel_url: `${request.nextUrl.origin}/api/payment/cancel`,
    }),
  }).then((res) => res.json())

  if (!data) {
    return NextResponse.json(
      { message: "Error making payment" },
      { status: 500 },
    )
  }

  const payment = await prisma.payment.create({
    data: {
      duration,
      tx: data.id,
    },
  })

  await prisma.node.create({
    data: {
      wallet,
      serverId,
      userId: session.user?.id,
      paymentId: payment.id,
      isLive: true,
    },
  })

  return NextResponse.json({
    message: "Charge created",
    data,
  })
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const nodeId = Number(url.searchParams.get("node"))

  const node = await prisma.node.findFirst({
    where: {
      id: nodeId,
    },
    include: {
      payment: true,
    },
  })

  if (!node) {
    return NextResponse.json(
      { message: "Node does not exist" },
      { status: 404 },
    )
  }

  const { data } = await fetch(
    `https://api.commerce.coinbase.com/charges/${node.payment.tx}`,
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

  if (data.timeline[0].status === "NEW") {
    return NextResponse.json(
      { message: "Payment not yet made", status: "NEW" },
      { status: 200 },
    )
  }

  if (data.timeline[0].status === "PENDING") {
    return NextResponse.json(
      { message: "Payment pending", status: "PENDING" },
      { status: 200 },
    )
  }

  if (data.timeline[0].status === "SIGNED") {
    return NextResponse.json(
      { message: "Payment signed", status: "SIGNED" },
      { status: 200 },
    )
  }

  await prisma.payment.updateMany({
    where: {
      tx: node.payment.tx,
    },
    data: {
      status: "COMPLETED",
    },
  })

  return NextResponse.json(
    { message: "Payment completed", status: "COMPLETED" },
    { status: 200 },
  )
}
