"use client"

import React from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoCloseOutline } from "react-icons/io5"
import { Sidebar } from ".."

export const SidebarMobile = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <div className="absolute top-10 right-5 cursor-pointer md:hidden z-[11]">
        <div
          onClick={() => {
            setIsOpen((prev) => !prev)
          }}
        >
          {isOpen ? (
            <IoCloseOutline className="text-white text-xl" />
          ) : (
            <GiHamburgerMenu className="text-white text-xl" />
          )}
        </div>
      </div>
      <Sidebar isOpen={isOpen} />
    </div>
  )
}
