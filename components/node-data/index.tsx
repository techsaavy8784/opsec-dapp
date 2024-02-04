import Image from "next/image"
import React from "react"

type Props = {
  active?: boolean
  uptime?: string
  title: string
  stats: {
    title: string
    value: string
  }[]
}

export const NodeData = ({ active, title, stats, uptime }: Props) => {
  console.log(uptime)

  return (
    <div className="p-4 rounded-[20px] bg-[#FFFFFF]">
      <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
        <h1 className="font-[600] text-[16px] text-[#000000]">{title}</h1>
        {active && (
          <div className="flex items-center gap-1">
            <Image
              src="/icons/tick-circle.svg"
              alt="tick-circle"
              width={18}
              height={18}
            />
            <h1 className="font-[600] text-[14px] text-[#10B981]">
              {uptime ? `${uptime}% Uptime` : "ACTIVE"}
            </h1>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 pt-3">
        {stats?.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <h1 className="text-[14px] font-[500] text-[#757575]">
              {item?.title}
            </h1>
            <h1 className="text-[14px] font-[500] text-[#000000]">
              {item?.value}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}
