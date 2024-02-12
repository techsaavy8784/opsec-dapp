import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
type Data = {
  fee: number | undefined
  description: string | undefined
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  const data: Data = {
    fee: undefined,
    description: undefined,
  }
  const { name, fee, description } = await req.json()
  if (description) data.description = description
  if (fee) data.fee = fee
  const node_exist = await db.nodes.findFirst({
    where: {
      name: name,
    },
  })
  if (node_exist) {
    const update = await db.nodes.update({
      where: {
        id: node_exist.id,
      },
      data: data,
    })
    return NextResponse.json({ message: "Node Updated", data: update })
  }

  const node = await db.nodes.create({
    data: {
      name,
      description,
      fee,
    },
  })
  return NextResponse.json({ message: "Node Created", data: node })
}
