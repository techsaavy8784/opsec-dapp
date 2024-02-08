import Image from "next/image"
import React from "react"

type Props = {
  title: string
  image: string
  value?: number
  linear?: boolean
  blockchains?: boolean
}

export const DashCards = ({
  title,
  image,
  value,
  linear,
  blockchains,
}: Props) => {
  return (
    <div className="px-4 border-r border-[#27272A]">
      <div
        className={`col-span-1 flex flex-col gap-2 p-4 pr-0 ${linear ? "bg-gradient-to-b rounded-lg from-[#1A1A1A] to-[#1A1A1A00]" : ""}`}
      >
        <Image src={image} alt="icon" width={22} height={22} />
        <p className="text-[14px] leading-[20px] font-[500] text-[#A6A6A6] mt-1">
          {title}
        </p>
        {blockchains && (
          <Image
            src="/icons/dash/blockchain.svg"
            width={130}
            height={48}
            alt="blockchain"
          />
        )}
        <h1 className="text-white text-[28px] font-[600]">{value}</h1>
      </div>
    </div>
  )
}
