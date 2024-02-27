"use client"

import React, { useEffect, useRef } from "react"
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
  const timer = useRef<NodeJS.Timeout>()

  const { isPending, data, refetch } = useQuery<NodeType>({
    queryKey: [`nodes/${id}`],
    queryFn: () => fetch(`/api/nodes/${id}`).then((res) => res.json()),
  })

  useEffect(() => {
    if (data?.status === "LIVE") {
      clearInterval(timer.current)
    } else {
      timer.current = setInterval(() => {
        refetch()
      }, 10000)
    }

    return () => clearInterval(timer.current)
  }, [data?.status, refetch])

  if (isPending || !data) {
    return (
      <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
    )
  }

  const daysPassed = Math.min(
    Math.round(
      (Date.now() - new Date(data.createdAt).getTime()) / (1000 * 3600 * 24),
    ),
    90,
  )

  return (
    <div className="space-y-2">
      <Image
        src={`/icons/blockchain/${data.server.blockchain.name
          .toLowerCase()
          .replace(/ /g, "-")}.png`}
        alt=""
        width={90}
        height={90}
        className="object-contain m-auto"
      />
      <h1 className="text-[#52525B]">{data.server.blockchain.description}</h1>
      <div className="flex items-center justify-between pt-5">
        <h1 className="text-[14px] font-[500] text-[#52525B]">Chain name</h1>
        <h1 className="text-[14px] font-[500] text-[#fff]">
          {data.server.blockchain.name}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-[500] text-[#52525B]">Stats</h1>
        <div className="flex items-center gap-1">
          <Image
            src="/icons/tick-circle.svg"
            alt="tick-circle"
            width={18}
            height={18}
          />
          <h1 className="font-[600] text-[14px] text-[#10B981]">
            {data.status.toUpperCase()}
          </h1>
        </div>
      </div>

      {data.status === "LIVE" && (
        <>
          <div className="flex items-center justify-between pt-3">
            <h1 className="text-[14px] font-[500] text-[#52525B]">
              Activated date
            </h1>
            <h1 className="text-[14px] font-[500] text-[#fff]">
              {formatDate(data.createdAt)}
            </h1>
          </div>

          <div className="flex">
            {new Array(daysPassed)
              .fill(0)
              ?.map((_, i) => (
                <div
                  key={i}
                  className={`w-[1%] h-[48px] m-[1px] bg-[#10B981] rounded-[3px]`}
                />
              ))}
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-[14px] font-[500] text-[#52525B]">
              {daysPassed} days ago
            </h1>
            <h1 className="text-[14px] font-[500] text-[#52525B]">Today</h1>
          </div>
        </>
      )}
    </div>
  )
}

export default Node
