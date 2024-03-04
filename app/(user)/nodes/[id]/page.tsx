"use client"

import React, { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { NodeType } from "../page"
import Image from "next/image"
import { daysPassedSince, formatDate } from "@/lib/utils"
import clsx from "clsx"
import { NodePaymentModal } from "@/components/payment-modal/node"
import { Button } from "@/components/ui/button"

interface NodeProps {
  params: {
    id: string
  }
}

const uptimeDayCount = 90

const Node: React.FC<NodeProps> = ({ params: { id } }) => {
  const timer = useRef<NodeJS.Timeout>()

  const [modal, setModal] = useState(false)

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

  const daysTillExpiration = Math.max(
    0,
    data.payments.reduce((sum, item) => (sum += item.duration), 0) -
      daysPassedSince(data.createdAt),
  )

  const soonExpired =
    daysTillExpiration < Number(process.env.NEXT_PUBLIC_NODE_EXPIRE_WARN_DAYS)

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
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">
            Days remaining
          </h1>
          <h1
            className={clsx(
              "text-[14px] font-[500]",
              soonExpired ? "text-yellow-500" : "text-white",
            )}
          >
            {daysTillExpiration}
          </h1>
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
        {/* {soonExpired && ( */}
        <div className="text-center">
          <Button onClick={() => setModal(true)}>Extend subscription</Button>
          <NodePaymentModal
            nodeId={data.id}
            open={modal}
            chain={data.blockchain}
            onOpenChange={() => setModal(false)}
            onPurchaseComplete={() => refetch()}
          />
        </div>
        {/* )} */}
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
