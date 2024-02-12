import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { name, fee, duration, address } = await req.json()
  const node_exist = await db.node_brand.findFirst({
    where: {
      name: name,
    },
  })
  if (!node_exist) {
    return NextResponse.json(
      { message: "Node does not exist" },
      { status: 404 },
    )
  }
  const user = await db.user.findFirst({
    where: {
      address: address,
    },
  })
  if (!user) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 404 },
    )
  }
  const amount = Number(node_exist.fee) * Number(duration)

  const charge = await fetch("https://api.commerce.coinbase.com/charges/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CC-Api-Key": process.env.COINBASE_API_KEY as string,
    },

    body: JSON.stringify({
      name: "Node Payment",
      description: "Payment for node",
      local_price: {
        amount: amount,
        currency: "ETH",
      },
      pricing_type: "fixed_price",
      metadata: {
        node_id: node_exist.id,
        fee: fee,
        duration,
      },
    }),
  })
  const charge_json = await charge.json()
  console.log(charge_json.data)

  if (!charge_json.data) {
    return NextResponse.json(
      { message: "Error creating charge" },
      { status: 500 },
    )
  }
  const payment = await db.payments.upsert({
    where: {
      charge_id: charge_json.data.id,
    },
    update: {
      user_id: user.id,
      node_id: node_exist.id,
      amount: amount,
      duration: duration,
      status: charge_json.data.payments[0]?.status,
    },
    create: {
      id: charge_json.data.id,
      user_id: user.id,
      node_id: node_exist.id,
      amount: amount,
      duration: duration,
      status: "NEW",
      charge_id: charge_json.data.id,
    },
  })
  if (!payment) {
    return NextResponse.json({
      message: "Charge created failed to update the db",
      data: charge_json.data,
    })
  }
  return NextResponse.json({
    message: "Charge created",
    data: charge_json.data,
  })
}
export async function GET(req: NextRequest) {
  const url = req.nextUrl
  // const node = url.searchParams.get("node")
  const address = url.searchParams.get("address")
  const payment_pending = await db.payments.findMany({
    where: {
      address: address,
      status: { in: ["NEW", "SIGNED", "PENDING"] },
    },
  })
  if (!payment_pending) {
    return NextResponse.json(
      { message: "No Payment found" },
      {
        status: 500,
      },
    )
  }
  console.log(payment_pending)

  const config = await fetch(
    `https://api.commerce.coinbase.com/charges/${payment_pending[0].charge_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_API_KEY as string,
      },
    },
  )
  const config_json = await config.json()
  console.log(config_json.data)
}
