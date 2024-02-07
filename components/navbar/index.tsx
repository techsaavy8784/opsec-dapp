"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const Navbar = () => {
  const pathName = usePathname()
  const path = pathName.split("/")[1] // TODO: Uppercase first letter

  return (
    <div className="sticky top-0 left-0 z-[10] w-full py-5">
      <div className="flex justify-between items-center py-2 px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold capitalize">{path}</h1>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}
