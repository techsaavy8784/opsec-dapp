import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const nodes = await db.node_brand.findMany()
  return NextResponse.json({ data: nodes })
}
