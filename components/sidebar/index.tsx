"use client"

import Image from "next/image"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
import React from "react"
import { MdChevronLeft } from "react-icons/md"

const Sidebar = ({ isOpen }: { isOpen?: boolean }) => {
  //   const pathName = usePathname()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const open = isOpen ? "open" : ""

  return (
    <aside className="w-64 sticky top-0 border-r border-[#27272A]">
      <div className="flex gap-3 p-6 items-center mb-5 relative">
        <div className="absolute right-0 w-5 h-10 bg-[#27272A] flex items-center justify-center rounded-l-[6px]">
          <MdChevronLeft className="text-[20px]" />
        </div>
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width={39}
          height={38}
          className={`max-md:overflow-hidden transition-all`}
        />
        <div
          className={`flex flex-col py-1 max-md:overflow-hidden transition-all`}
        >
          <h1 className="text-[16px] font-[600] leading-6 text-white">OpSec</h1>
          <h1 className="text-[16px] font-[600] leading-6 text-white">
            CloudVerse
          </h1>
        </div>
      </div>
      <div></div>
    </aside>
  )
}

export { Sidebar }
