"use client"

import Image from "next/image"
import React from "react"
import { Button } from "@/components/ui/button"
import { FaArrowRightLong } from "react-icons/fa6"
import Link from "next/link"

type NodeCardProps = {
  name: string
  description: string
  enabled: boolean
  onRunNodeClick?: () => void
}

export const NodeCard: React.FC<NodeCardProps> = ({
  name,
  description,
  enabled,
  onRunNodeClick,
}) => (
  <div className="col-span-1 p-4 rounded-[16px] backdrop:blur-[100px] overflow-hidden flex flex-col gap-4 border border-zinc-600">
    <div className="flex-1">
      <div className="flex bg-[url(/image/node.png)] rounded-[16px] bg-center bg-cover bg-no-repeat h-[172px] justify-center items-center ">
        <div className="w-[40%] h-[40%] flex justify-center items-center">
          {" "}
          <Image
            src={`/icons/blockchain/${name
              .toLowerCase()
              .replace(/ /g, "-")}.png`}
            alt=""
            width={180} // Set to your base width
            height={180} // Set to your base height
            className="object-contain ml-1 mt-2" // Ensure the image scales correctly within its container
          />
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <h1 className="text-white font-[600] text-[16px]">{name}</h1>
      <p className="text-[#BDBDBD] font-[500] text-[12px]">{description}</p>
    </div>
    {onRunNodeClick ? (
      <Button type="button" variant="custom" onClick={onRunNodeClick}>
        Start
        <FaArrowRightLong className="ml-2 font-[300]" />
      </Button>
    ) : (
      <Button asChild variant="custom">
        <Link href="/dashboard/123">
          Start
          <FaArrowRightLong className="ml-2 font-[300]" />
        </Link>
      </Button>
    )}
  </div>
)
