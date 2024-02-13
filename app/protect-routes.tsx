"use client"

import React from "react"
import { useAccount } from "wagmi"
import { signIn, signOut } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"

interface ProtectRoutesProps {
  children: React.ReactNode
}

const ProtectRoutes: React.FC<ProtectRoutesProps> = ({ children }) => {
  const pathname = usePathname()

  const { isConnected } = useAccount({
    onConnect: ({ address }) => {
      signIn("credentials", {
        address,
        redirect: false,
        callbackUrl: "/dashboard",
      })
    },
    onDisconnect: () => {
      signOut()
    },
  })

  if (pathname.startsWith("/admin")) {
    return children
  }

  if (pathname === "/connect-wallet") {
    if (isConnected) {
      redirect("/dashboard")
    } else {
      return children
    }
  } else if (isConnected) {
    return children
  } else {
    redirect("/connect-wallet")
  }
}

export default ProtectRoutes
