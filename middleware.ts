import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(request) {
    const isAdmin = request.nextauth?.token?.email
    const pathname = request.nextUrl?.pathname

    if (pathname === "/admin/login") {
      if (isAdmin) {
        const adminurl = new URL("/admin", request.nextUrl.origin)
        return NextResponse.redirect(adminurl.toString())
      } else {
        return NextResponse.next()
      }
    }
    if (pathname.startsWith("/admin")) {
      if (isAdmin) {
        return NextResponse.next()
      } else {
        const adminloginurl = new URL("/admin/login", request.nextUrl.origin)
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
