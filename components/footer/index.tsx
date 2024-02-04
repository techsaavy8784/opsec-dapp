import Image from "next/image"
import React from "react"
import { RiTwitterXFill } from "react-icons/ri"
import { PiTelegramLogo } from "react-icons/pi"

export const Footer = () => {
  return (
    <footer className="px-12 fixed bottom-0 left-0 w-full z-[10]">
      <div className="border-t border-[#FFFFFF66] w-full py-8 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Image src="/icons/logo.svg" alt="logo" width={39} height={38} />
          <div className="flex flex-col  py-1">
            <h1 className="text-[16px] font-[600] leading-6 text-white">
              OpSec
            </h1>
          </div>
        </div>
        <div className="flex items-center py-[6px]">
          <h1 className="px-4 font-[500] text-[16px] leading-[24px] text-white border-r-2 border-[#FFFFFF33]">
            Privacy Policy
          </h1>
          <h1 className="px-4 font-[500] text-[16px] leading-[24px] text-white border-r-2 border-[#FFFFFF33]">
            [Email]
          </h1>
          <div className="px-4 border-r-2 border-[#FFFFFF33]">
            <RiTwitterXFill className="text-[24px] leading-[24px] text-white" />
          </div>
          <div className="px-4">
            <PiTelegramLogo className="text-[24px] leading-[24px] text-white" />
          </div>
        </div>
      </div>
    </footer>
  )
}
