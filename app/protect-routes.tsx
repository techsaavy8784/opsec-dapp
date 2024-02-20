"use client"

import React from "react"
import { useAccount, useNetwork } from "wagmi"
import { signIn, signOut, useSession } from "next-auth/react"
import { mainnet, sepolia, Chain } from "wagmi/chains"
import { redirect, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface ProtectRoutesProps {
  children: React.ReactNode
}

const chainId = (process.env.NODE_ENV === "production" ? mainnet : sepolia).id

const ProtectRoutes: React.FC<ProtectRoutesProps> = ({ children }) => {
  const { status, data: session } = useSession()
  const { chain } = useNetwork()

  console.log(`status: ${status}`)
  console.log(`data:`)
  console.log(session)

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to sign-in page
      signIn()
    } else if (chain?.id !== chainId) {
      //   alert(
      //     `Please switch to the ${
      //       process.env.NODE_ENV === "production" ? "mainnet" : "sepolia"
      //     } network.`,
      //   )
    }
  }, [status, chain, session])

  if (
    status === "loading" ||
    (status === "authenticated" && chain?.id !== chainId)
  ) {
    return <div>Loading...</div>
  }

  return children
}

export default ProtectRoutes
