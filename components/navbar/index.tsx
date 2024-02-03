"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { DashboardNav } from "./dashboard-nav"
import { ShopNav } from "./shop-nav"
import { BillinNav } from "./billing-nav"

export const Navbar = () => {
  const pathName = usePathname()
  const path = pathName.split("/")[1]

  const renderNavbar = () => {
    switch (path) {
      case "dashboard":
        return <DashboardNav pathName={pathName} />
      case "shop":
        return <ShopNav />
      case "billing-history":
        return <BillinNav />
      default:
        return <DashboardNav pathName={pathName} />
    }
  }
  return (
    <div className="sticky top-0 left-0 z-[10] w-full">
      <nav className="py-8 grid grid-cols-5 items-start">
        <div className="col-span-4">{renderNavbar()}</div>
        <div className="col-span-1 rounded-[12px] border-2 border-[#FFFFFF80] mt-3">
          <div className="py-3 px-4 flex items-center gap-3 justify-center">
            <h1 className="text-white font-[600] text-[16px]">
              0xF914sd3...4n143
            </h1>
          </div>
        </div>
      </nav>
    </div>
  )
}
