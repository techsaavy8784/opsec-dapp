"use client"

import React from "react"
import { redirect, usePathname } from "next/navigation"
import useConnected from "@/hooks/useConnected"

interface ProtectRoutesProps {
  children: React.ReactNode
}

const ProtectRoutes: React.FC<ProtectRoutesProps> = ({ children }) => {
  const pathname = usePathname()
  const { connected, status } = useConnected()

  if (pathname.startsWith("/manage")) {
    return <>{children}</>
  }

  if (status === "loading") {
    return <>{children}</>
  }

  if (pathname === "/connect-wallet" && connected) {
    redirect("/dashboard")
  }

  if (pathname !== "/connect-wallet" && !connected) {
    redirect("/connect-wallet")
  }

  return <>{children}</>
}

export default ProtectRoutes
