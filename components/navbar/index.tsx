"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const Navbar = () => {
  const pathName = usePathname()
  const path = pathName.split("/")[1] // TODO: Uppercase first letter

  return (
    <div className="sticky top-0 left-0 z-[10] w-full mb-10">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{path}</h1>
        </div>

        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}
