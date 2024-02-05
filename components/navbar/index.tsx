"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { DashboardNav } from "./dashboard-nav"
import { ShopNav } from "./shop-nav"
import { BillinNav } from "./billing-nav"
import { Connect } from "../connect-button"

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
      <nav className="py-8 px-12 md:px-0 md:pl-12 grid grid-cols-5 items-start">
        <div className="col-span-5 md:col-span-4">{renderNavbar()}</div>
        <div className="col-span-1 max-md:hidden">
          <Connect />
        </div>
      </nav>
    </div>
  )
}
