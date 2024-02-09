"use client"

import Image from "next/image"
import React from "react"
import { Button } from "@/components/ui/button"
import { FaArrowRightLong } from "react-icons/fa6"
import Link from "next/link"

type NodeCardProps = {
  title: string
  description: string
  onRunNodeClick?: () => void
}

export const NodeCard: React.FC<NodeCardProps> = ({
  title,
  description,
  onRunNodeClick,
}) => (
  <div
    style={{
      background:
        "radial-gradient(0.51% 35.77% at 99.5% 53.54%, rgb(255, 255, 255) 0.55%, rgba(255, 255, 255, 0.06) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
    }}
    className="col-span-1 p-4 rounded-[16px] backdrop:blur-[100px] overflow-hidden flex flex-col gap-4"
  >
    <div className="flex-1">
      <Image
        src="/image/node.png"
        alt=""
        width={216}
        height={118}
        className="rounded-[16px] w-full"
      />
    </div>
    <div className="flex flex-col gap-2">
      <h1 className="text-white font-[600] text-[16px]">{title}</h1>
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
