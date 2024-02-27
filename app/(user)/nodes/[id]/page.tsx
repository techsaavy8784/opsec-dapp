"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { NodeType } from "../page"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface NodeProps {
  params: {
    id: string
  }
}

const Node: React.FC<NodeProps> = ({ params: { id } }) => {
  const { isPending, data } = useQuery<NodeType>({
    queryKey: [`nodes/${id}`],
    queryFn: () => fetch(`/api/nodes/${id}`).then((res) => res.json()),
  })

  if (isPending || !data) {
    return (
      <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-[20px] bg-[#18181B] space-y-2">
        <div className="flex bg-[url(/image/node.png)] rounded-[16px] bg-center bg-cover bg-no-repeat h-[172px] justify-center items-center ">
          <Image
            src={`/icons/blockchain/${data.server.blockchain.name
              .toLowerCase()
              .replace(/ /g, "-")}.png`}
            alt=""
            width={180}
            height={180}
            className="object-contain m-auto"
          />
        </div>
        <h1 className="text-[#52525B]">{data.server.blockchain.description}</h1>
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">Chain name</h1>
          <Image
            src="/icons/celestia-node.svg"
            alt="icon"
            width={20}
            height={20}
          />
          {/* <h1 className="font-[600] text-[16px] text-[#fff]">
            {data.server.blockchain.name}
          </h1> */}
        </div>
      </div>
      <div className="p-4 rounded-[20px] bg-[#18181B] space-y-2">
        <div className="flex items-center justify-between pb-3 border-b border-[#52525B]">
          <h1 className="font-[600] text-[16px] text-[#fff]">Nodes Stats</h1>
          <div className="flex items-center gap-1">
            <Image
              src="/icons/tick-circle.svg"
              alt="tick-circle"
              width={18}
              height={18}
            />
            <h1 className="font-[600] text-[14px] text-[#10B981]">ACTIVE</h1>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">
            Total time validating
          </h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">23 mins</h1>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">
            Time last active
          </h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">2d ago</h1>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">
            Last rotation index
          </h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">1.5 hrs</h1>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">
            Activated date
          </h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">2d ago</h1>
        </div>

        <div className="flex">
          {new Array(100)
            .fill(0)
            ?.map((_, i) => (
              <div
                key={i}
                className={`w-[1%] h-[48px] m-[1px] ${
                  i === 24 || i === 25 ? "bg-[#F87171]" : "bg-[#10B981] "
                } rounded-[3px]`}
              />
            ))}
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">90 days ago</h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">Today</h1>
        </div>
      </div>
    </div>
  )
}

export default Node
