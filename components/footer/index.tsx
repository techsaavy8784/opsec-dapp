import Image from "next/image"
import React from "react"
import { RiTwitterXFill } from "react-icons/ri"
import { PiTelegramLogo } from "react-icons/pi"

export const Footer = () => {
  return (
    <footer className="px-3 md:px-12 fixed bottom-0 left-0 w-full z-[10]">
      <div className="border-t border-[#FFFFFF66] w-full py-4 md:py-8 flex max-md:flex-col max-md:gap-4 md:justify-between items-center">
        <div className="flex gap-3 items-center">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={39}
            height={38}
            className="max-md:w-[25px] max-md:h-[24px]"
          />
          <div className="flex flex-col py-1">
            <h1 className="text-sm md:text-[16px] font-[600] md:leading-6 text-white">
              OpSec
            </h1>
          </div>
        </div>
        <div className="flex items-center py-[6px]">
          <h1 className="px-4 font-[500] text-sm md:text-[16px] md:leading-[24px] text-white border-r-2 border-[#FFFFFF33]">
            Privacy Policy
          </h1>
          <h1 className="px-4 font-[500] text-sm md:text-[16px] md:leading-[24px] text-white border-r-2 border-[#FFFFFF33]">
            [Email]
          </h1>
          <div className="px-4 border-r-2 border-[#FFFFFF33]">
            <RiTwitterXFill className="text-sm md:text-[24px] md:leading-[24px] text-white" />
          </div>
          <div className="px-4">
            <PiTelegramLogo className="text-lg md:text-[24px] md:leading-[24px] text-white" />
          </div>
        </div>
      </div>
    </footer>
  )
}
