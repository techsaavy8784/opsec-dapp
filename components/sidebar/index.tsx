"use client"

import Image from "next/image"
import React from "react"

const Sidebar = () => {
  const [active, setActive] = React.useState("Dashboard")
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Shop",
      path: "/shop",
    },
    {
      name: "Billing History",
      path: "/billing-history",
    },
  ]
  return (
    <aside className="sticky top-0 left-0 h-screen pl-12 pt-8 flex flex-col gap-[68px]">
      <div className="flex gap-3 items-center">
        <Image src="/icons/logo.svg" alt="logo" width={39} height={38} />
        <div className="flex flex-col  py-1">
          <h1 className="text-[16px] font-[600] leading-6 text-white">OpSec</h1>
          <h1 className="text-[16px] font-[600] leading-6 text-white">
            Node Managment
          </h1>
        </div>
      </div>
      <div className="flex flex-col py-5">
        {navItems?.map((item, index) => (
          <div
            className={`relative py-3 ${item.name === active ? "" : "border-l-2 border-[#FFFFFF66]"}`}
            key={index}
            onClick={() => setActive(item?.name)}
          >
            <h1
              className={`pl-10 ${active === item?.name ? "text-white font-[600] " : "text-[#FFFFFF80] font-[500] "} cursor-pointer transition-all duration-200 text-lg`}
            >
              {item.name}
            </h1>
            {active === item?.name && (
              <>
                <div
                  className={`w-[16px] h-[16px] transition-all duration-200 absolute top-0 left-0 -translate-x-[6.5px] translate-y-[16px] rotate-45 border-t-2 border-r-2 border-t-white border-r-white`}
                />
                <div className="w-[2px] h-[20px] transition-all duration-200 bg-white absolute top-0  -translate-y-[6px] left-0" />
                <div className="w-[2px] h-[20px] transition-all duration-200 bg-white absolute top-full  -translate-y-[18px] left-0" />
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export { Sidebar }
