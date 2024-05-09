"use client"

import React from "react"
import Image from "next/image"
import { daysPassedSince, formatDate } from "@/lib/utils"
import clsx from "clsx"
import { NodeType } from "@/app/(user)/nodes/page"

const uptimeDayCount = 90

type Props = {
  data: NodeType
}

export const PartialNode: React.FC<Props> = ({ data }) => {
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
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">Ownership</h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">
            {data.ownership * 100} %
          </h1>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">
            Reward Amount
          </h1>
          <h1 className="text-[14px] font-[500] text-[#fff]">{data.reward}</h1>
        </div>
      </div>

      {!data.server && (
        <h1 className="text-[#fff] text-center sm:w-1/2 m-auto pb-4">
          Waiting for admin to activate on server
        </h1>
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
