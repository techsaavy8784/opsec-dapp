/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import {
  DashboardIcon,
  MarketplaceIcon,
  NodesIcon,
  ValidatorsIcon,
  TreasuryIcon,
  BillingIcon,
} from "@/components/icons"
import useConnected from "@/hooks/useConnected"
import { useQuery } from "@tanstack/react-query"

type Props = {
  setOpen?: (value: boolean) => void
}

type NavItem = {
  title: string
  link: string
  icon: React.ElementType
}

const Sidebar = ({ setOpen }: Props) => {
  const path = usePathname()
  const pathName = path.split("/")[1]
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      link: "dashboard",
      icon: DashboardIcon,
    },
    {
      title: "Marketplace",
      link: "marketplace",
      icon: MarketplaceIcon,
    },
    {
      title: "Nodes",
      link: "nodes",
      icon: NodesIcon,
    },
    {
      title: "Treasury",
      link: "treasury",
      icon: TreasuryIcon,
    },
    {
      title: "Staking",
      link: "staking",
      icon: TreasuryIcon,
    },
    {
      title: "Reward",
      link: "reward",
      icon: TreasuryIcon,
    },
    {
      title: "Billing",
      link: "billing",
      icon: BillingIcon,
    },
  ]

  const { connected } = useConnected()

  const { data: balance } = useQuery({
    queryKey: ["credits/balance"],
    queryFn: () =>
      connected && fetch("/api/credits/balance").then((res) => res.json()),
  })

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
      <div className="flex flex-col justify-between flex-1">
        <div className={`flex flex-col gap-14 md:gap-6`}>
          {navItems?.map((item, index) => (
            <Link
              key={index}
              href={`/${item.link}`}
              onClick={() => setOpen && setOpen(false)}
              className={`flex items-center gap-4 pl-8 py-2 hover:bg-[#48474761] transition-all ease-in duration-100 border-l-[3px] cursor-pointer ${
                pathName === item.link
                  ? "border-[#F44336]"
                  : "border-transparent"
              }`}
            >
              <item.icon isActive={pathName === item.link} />
              <h1
                className={` ${
                  pathName === item.link ? "text-white" : "text-[#52525B]"
                } font-[600] text-[16px]`}
              >
                {item.title}
              </h1>
            </Link>
          ))}
        </div>
        <div className={`flex items-center justify-center py-8 md:py-4`}>
          <Link href="https://x.com/OpSecCloud">
            <Image
              src="/backgrounds/twitter-banner.png"
              alt="twitter-banner"
              width={210}
              height={260}
              className="max-md:hidden"
            />
          </Link>
          <div className="flex items-center space-x-3 md:hidden">
            {connected && balance && (
              <div className="font-bold">Balance {balance.balance}</div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
