"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useQuery } from "@tanstack/react-query"
import useConnected from "@/hooks/useConnected"

export const Navbar = () => {
  const { connected } = useConnected()

  const { data: balance } = useQuery({
    queryKey: ["credits/balance"],
    queryFn: () =>
      connected && fetch("/api/credits/balance").then((res) => res.json()),
  })

  const pathName = usePathname()
  const path = pathName.split("/")[1]

  return (
    <div className="sticky top-0 left-0 z-[10] w-full py-5">
      <div className="flex justify-between items-center py-2 px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold capitalize">{path}</h1>
        </div>
        <div className="max-md:hidden flex items-center space-x-3">
          {connected && balance && (
            <div className="font-bold">Balance {balance.balance}</div>
          )}
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </div>
  )
}
