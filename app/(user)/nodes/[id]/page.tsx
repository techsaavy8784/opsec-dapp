"use client"

import React, { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { PAY_TYPE } from "@prisma/client"
import Image from "next/image"
import clsx from "clsx"
import usePollStatus from "@/hooks/usePollStatus"
import { NodeType } from "@/app/(user)/nodes/page"
import { Skeleton } from "@/components/ui/skeleton"
import { FullNode } from "./full-paid-node"
import { PartialNode } from "./partial-paid-node"
import { daysPassedSince, formatDate } from "@/lib/utils"

interface NodeProps {
  params: {
    id: string
  }
}

const uptimeDayCount = 90

const Node: React.FC<NodeProps> = ({ params: { id } }) => {
  const { isPending, data, refetch } = useQuery<NodeType>({
    queryKey: [`nodes/${id}`],
    queryFn: () => fetch(`/api/nodes/${id}`).then((res) => res.json()),
  })

  const { startPoll } = usePollStatus({
    cb: () => refetch(),
    stopWhen: () => data?.status === "LIVE",
    interval: 10000,
  })

  useEffect(() => {
    if (data?.status !== "LIVE") {
      startPoll()
    }
  }, [data?.status, startPoll])

  if (isPending || !data) {
    return (
      <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
    )
  }

  return (
    <div className="w-full space-y-2">
      <Image
        src={`/icons/blockchain/${data.blockchain.name
          .toLowerCase()
          .replace(/ /g, "-")}.png`}
        alt=""
        width={90}
        height={90}
        className="object-contain m-auto"
      />
      <h1 className="text-[#52525B] text-center sm:w-1/2 m-auto pb-4">
        {data.blockchain.description}
      </h1>
      <div className="m-auto space-y-3 sm:w-1/4">
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">Chain</h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">
            {data.blockchain.name}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-[500] text-[#52525B]">Status</h1>
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
      {data.blockchain.payType === PAY_TYPE.FULL ? (
        <FullNode node={data} refetch={refetch} />
      ) : (
        <PartialNode node={data} />
      )}
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
          <h1 className="text-[14px] font-[500] text-[#52525B]">Uptime</h1>
          <div className="flex flex-row-reverse">
            {new Array(uptimeDayCount)
              .fill(0)
              ?.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    `w-[1%] h-[48px] m-[1px] rounded-[3px]`,
                    i <= daysPassedSince(data.createdAt)
                      ? "bg-[#10B981]"
                      : "bg-zinc-900",
                  )}
                />
              ))}
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-[14px] font-[500] text-[#52525B]">
              {uptimeDayCount} days ago
            </h1>
            <h1 className="text-[14px] font-[500] text-[#52525B]">Today</h1>
          </div>
        </>
      )}
    </div>
  )
}

export default Node
