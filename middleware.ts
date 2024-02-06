import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(request) {
    const token = request.nextauth?.token
    console.log({ token })
    const pathname = request.nextUrl?.pathname
    if (pathname === "/adminlogin") {
      if (token) {
        const adminurl = new URL("/admin", request.nextUrl.origin)
        return NextResponse.redirect(adminurl.toString())
      } else {
        return NextResponse.next()
      }
    }
    if (pathname.startsWith("/admin")) {
      if (token) {
        return NextResponse.next()
      } else {
        const adminloginurl = new URL("/adminlogin", request.nextUrl.origin)
        return NextResponse.redirect(adminloginurl.toString())
      }
    } else {
      return NextResponse.next()
    }
  },
  {
    callbacks: {
      authorized: async () => true,
    },
  },
)
