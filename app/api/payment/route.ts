import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { name, fee, duration } = await req.json()
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
  return NextResponse.json({
    message: "Charge created",
    data: charge_json.data,
  })
}
