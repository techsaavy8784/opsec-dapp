"use client"

import React from "react"
import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"
import { mainnet, sepolia } from "wagmi/chains"
import { redirect, usePathname } from "next/navigation"

interface ProtectRoutesProps {
  children: React.ReactNode
}

const chainId = (process.env.NODE_ENV === "production" ? mainnet : sepolia).id

const ProtectRoutes: React.FC<ProtectRoutesProps> = ({ children }) => {
  const pathname = usePathname()
  const { isConnected, chain } = useAccount()
  const { status } = useSession()

  const connected =
    isConnected && status === "authenticated" && chain?.id === chainId

  if (pathname.startsWith("/admin")) {
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
