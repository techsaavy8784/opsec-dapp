import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { address, password } = body

    console.log(address, password)
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        address, // Assuming 'address' is the field used for email in your schema
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
