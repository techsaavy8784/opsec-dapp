"use client"

import React from "react"
import { useAccount, useNetwork } from "wagmi"
import { signIn, signOut } from "next-auth/react"
import { mainnet, sepolia, Chain } from "wagmi/chains"
import { redirect, usePathname } from "next/navigation"

interface ProtectRoutesProps {
  children: React.ReactNode
}

const chainId = (process.env.NODE_ENV === "production" ? mainnet : sepolia).id

const ProtectRoutes: React.FC<ProtectRoutesProps> = ({ children }) => {
  const pathname = usePathname()
  const { chain } = useNetwork()
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
    if (isConnected && chain?.id === chainId) {
      redirect("/dashboard")
    } else {
      return children
    }
  } else if (isConnected && chain?.id === chainId) {
    return children
  } else {
    redirect("/connect-wallet")
  }
}

export default ProtectRoutes
