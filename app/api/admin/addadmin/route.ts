import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { hash } from "bcrypt"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    console.log({ body })
    const { email, password } = body

    const existingUser = await db.admin.findFirst({
      where: { email: body.email },
    })
    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "email already exists" },
        { status: 409 },
      )
    }

    // Create user
    const hashedPassword = await hash(password, 10)
    const newUser = await db.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    })
    console.log({ newUser })
    return NextResponse.json(
      { user: newUser, message: `Admin added` },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      //   { message: 'An error occurred' },
      { message: error },
      { status: 500 },
    )
  }
}
