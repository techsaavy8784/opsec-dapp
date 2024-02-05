import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
type Data = {
  fee: number | undefined
  description: string | undefined
}
export async function POST(req: NextRequest) {
  const data: Data = {
    fee: undefined,
    description: undefined,
  }
  const { name, fee, description } = await req.json()
  if (description) data.description = description
  if (fee) data.fee = fee
  const node_exist = await db.node_brand.findFirst({
    where: {
      name: name,
    },
  })
  if (node_exist) {
    const update = await db.node_brand.update({
      where: {
        id: node_exist.id,
      },
      data: data,
    })
    return NextResponse.json({ message: "Node Updated", data: update })
  }

  const node = await db.node_brand.create({
    data: {
      name,
      description,
      fee,
    },
  })
  return NextResponse.json({ message: "Node Created", data: node })
}
