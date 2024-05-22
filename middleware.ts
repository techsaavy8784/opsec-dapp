import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(request) {
    const isAdmin = request.nextauth?.token?.role === "ADMIN"
    const pathname = request.nextUrl?.pathname

    if (pathname.startsWith("/manage")) {
      if (pathname === "/manage/register" || pathname === "/manage/login") {
        return NextResponse.next()
      }

      if (isAdmin) {
        if (!pathname.startsWith("/manage/user")) {
          const adminUserUrl = new URL("/manage/user", request.nextUrl.origin)
          return NextResponse.redirect(adminUserUrl.toString())
        }
        return NextResponse.next()
      } else {
        const adminLoginUrl = new URL("/manage/login", request.nextUrl.origin)
        return NextResponse.redirect(adminLoginUrl.toString())
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
