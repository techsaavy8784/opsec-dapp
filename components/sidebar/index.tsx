/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

const Sidebar = () => {
  const pathName = usePathname()

  const [isOpen, setIsOpen] = React.useState(true)

  const navItems = [
    {
      title: "Dashbaord",
      icon: "dashboard.svg",
      link: "/dashboard",
      activeIcon: "dashboard-active.svg",
    },
    {
      title: "Nodes",
      icon: "nodes.svg",
      link: "/nodes",
      activeIcon: "nodes-active.svg",
    },
    {
      title: "Validators",
      icon: "validators.svg",
      link: "/validators",
      activeIcon: "validators-active.svg",
    },
    {
      title: "Treasuries",
      icon: "treasuries.svg",
      link: "/treasuries",
      activeIcon: "treasuries-active.svg",
    },
    {
      title: "Billing History",
      icon: "billing-history.svg",
      link: "/billing-history",
      activeIcon: "billing-history-active.svg",
    },
  ]

  return (
    <aside
      className={`sticky top-0 flex flex-col h-[100dvh] border-r border-[#27272A]`}
    >
      <div
        className={`flex gap-3 p-6 items-center mb-5 relative transition-all ${isOpen ? "w-64" : "w-24"}`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute right-0 w-5 h-10 bg-[#27272A] flex items-center justify-center rounded-l-[6px]`}
        >
          {isOpen ? (
            <MdChevronLeft className="text-[20px]" />
          ) : (
            <MdChevronRight className="text-[20px]" />
          )}
        </button>
        <Image src="/icons/logo.svg" alt="logo" width={39} height={38} />
        <div className={`flex flex-col py-1`}>
          <h1
            className={`text-[16px] font-[600] leading-6 text-white transition-all overflow-hidden ${isOpen ? "w-32" : "w-0"}`}
          >
            OpSec
          </h1>
          <h1
            className={`text-[16px] font-[600] leading-6 text-white transition-all overflow-hidden ${isOpen ? "w-32" : "w-0"}`}
          >
            CloudVerse
          </h1>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <div className={`flex flex-col gap-6`}>
          {navItems?.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center transition-all overflow-hidden ${isOpen ? "w-64" : "w-24"} gap-4 pl-8 py-2 hover:bg-[#48474761] transition-all ease-in duration-100 border-l-[3px] ${pathName === item.link ? "border-[#F44336]" : "border-transparent"}`}
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
                className={`transition-all text-nowrap overflow-hidden ${isOpen ? "w-32" : "w-0"} ${pathName === item.link ? "text-white" : "text-[#52525B]"} font-[600] text-[16px]`}
              >
                {item.title}
              </h1>
            </Link>
          ))}
        </div>
        <div
          className={`flex items-center justify-center py-4 overflow-hidden transition-all ${isOpen ? "w-64" : "w-0"}`}
        >
          <Image
            src="/backgrounds/twitter-banner.png"
            alt="twitter-banner"
            width={210}
            height={260}
            className={`transition-all ${isOpen ? "w-[210px]" : "w-0"}`}
          />
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
