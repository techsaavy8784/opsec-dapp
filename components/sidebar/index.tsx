/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

type Props = {
  setOpen?: (value: boolean) => void
}

const Sidebar = ({ setOpen }: Props) => {
  const path = usePathname()
  const pathName = path.split("/")[1]
  const navItems = [
    {
      title: "Dashbaord",
      icon: "dashboard.svg",
      link: "dashboard",
      activeIcon: "dashboard-active.svg",
    },
    {
      title: "Nodes",
      icon: "nodes.svg",
      link: "nodes",
      activeIcon: "nodes-active.svg",
    },
    {
      title: "Validators",
      icon: "validators.svg",
      link: "validators",
      activeIcon: "validators-active.svg",
    },
    {
      title: "Treasury",
      icon: "treasuries.svg",
      link: "treasury",
      activeIcon: "treasuries-active.svg",
    },
    {
      title: "Billing History",
      icon: "billing-history.svg",
      link: "billing-history",
      activeIcon: "billing-history-active.svg",
    },
  ]

  return (
    <aside
      className={`absolute md:sticky top-0 flex flex-col h-[100dvh] border-r border-[#27272A] w-screen max-md:bg-black max-md:z-[15] md:w-64`}
    >
      <div
        className={`flex gap-3 max-md:py-4 md:p-6 items-center max-md:justify-center mb-5 max-md:border-b max-md:border-[#27272A] relative`}
      >
        <Image src="/icons/logo.svg" alt="logo" width={39} height={38} />
        <div className={`flex md:flex-col py-1`}>
          <h1 className={`text-[16px] font-[600] leading-6 text-white`}>
            OpSec
          </h1>
          <h1 className={`text-[16px] font-[600] leading-6 text-white`}>
            CloudVerse
          </h1>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <div className={`flex flex-col gap-14 md:gap-6`}>
          {navItems?.map((item, index) => (
            <Link
              key={index}
              href={`/${item.link}`}
              onClick={() => setOpen && setOpen(false)}
              className={`flex items-center gap-4 pl-8 py-2 hover:bg-[#48474761] transition-all ease-in duration-100 border-l-[3px] ${pathName === item.link ? "border-[#F44336]" : "border-transparent"}`}
            >
              <Image
                src={
                  pathName === item.link
                    ? `/icons/nav/${item.activeIcon}`
                    : `/icons/nav/${item.icon}`
                }
                alt="dash-icon"
                width={24}
                height={24}
              />
              <h1
                className={` ${pathName === item.link ? "text-white" : "text-[#52525B]"} font-[600] text-[16px]`}
              >
                {item.title}
              </h1>
            </Link>
          ))}
        </div>
        <div className={`flex items-center justify-center py-8 md:py-4`}>
          <Image
            src="/backgrounds/twitter-banner.png"
            alt="twitter-banner"
            width={210}
            height={260}
            className="max-md:hidden"
          />
          <div className="md:hidden">
            <ConnectButton />
          </div>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
