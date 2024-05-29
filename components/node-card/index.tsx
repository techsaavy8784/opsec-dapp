"use client"

import Image from "next/image"
import React from "react"
import { Button } from "@/components/ui/button"
import { FaArrowRightLong } from "react-icons/fa6"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { PAY_TYPE } from "@prisma/client"

type NodeCardProps = {
  id?: number
  created?: string
  name: string
  description: string
  disabled?: boolean
  status?: string
  expireInDays?: number
  payType: PAY_TYPE
  onBuy?: () => void
}

export const NodeCard: React.FC<NodeCardProps> = ({
  id,
  name,
  created,
  description,
  disabled,
  status,
  expireInDays,
  payType,
  onBuy,
}) => (
  <div className="col-span-1 p-4 rounded-[16px] backdrop:blur-[100px] overflow-hidden flex flex-col gap-4 border border-zinc-600 h-full">
    <div className="flex bg-[url(/image/node.png)] rounded-[16px] bg-center bg-cover bg-no-repeat h-[172px] justify-center items-center ">
      <Image
        src={`/icons/blockchain/${name.toLowerCase().replace(/ /g, "-")}.png`}
        alt=""
        width={120}
        height={120}
        className="object-contain pt-3 m-auto"
      />
    </div>
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-center">
        <h1 className="text-white font-[600] text-[16px]">{name}</h1>
        <div className="flex space-x-2">
          {expireInDays !== undefined &&
            expireInDays <
              Number(process.env.NEXT_PUBLIC_NODE_EXPIRE_WARN_DAYS) && (
              <Badge>{expireInDays} days left</Badge>
            )}
          {payType === PAY_TYPE.PARTIAL && <Badge>PARTIAL</Badge>}
          {status && <Badge>{status}</Badge>}
        </div>
      </div>
      <p className="text-[#BDBDBD] font-[500] text-[12px] line-clamp-2">
        {description}
      </p>
      <p className="text-[#BDBDBD] font-[500] text-[12px]">{created}</p>
    </div>
    {disabled ? (
      <Button type="button" variant="custom" disabled>
        Sold out
      </Button>
    ) : isComing ? (
      <Button type="button" variant="custom" disabled>
        Coming Soon
      </Button>
    ) : onBuy ? (
      <Button type="button" variant="custom" onClick={onBuy}>
        Deploy
        <FaArrowRightLong className="ml-2 font-[300]" />
      </Button>
    ) : (
      id !== undefined && (
        <Button asChild variant="custom">
          <Link href={`nodes/${id}`}>
            Details
            <FaArrowRightLong className="ml-2 font-[300]" />
          </Link>
        </Button>
      )
    )}
  </div>
)
