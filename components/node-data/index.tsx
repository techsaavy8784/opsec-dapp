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
  icon?: string
}

export const NodeData = ({ active, title, stats, uptime, icon }: Props) => {
  console.log(uptime)
  const uptimeArr = new Array(100).fill(0)
  return (
    <div className="p-4 rounded-[20px] bg-[#18181B]">
      {active && (
        <div className="flex items-center justify-between pb-3 border-b border-[#52525B] mb-3">
          <h1 className="font-[600] text-[16px] text-[#fff]">{title}</h1>
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
      )}
      <div className="flex flex-col gap-2">
        {stats?.map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            {i == 2 && uptime && (
              <div className="grid grid-cols-100 gap-2 max-md:gap-[0.5px]">
                {uptimeArr?.map((_, i) => (
                  <div
                    key={i}
                    className={`h-[48px] md:w-[7.79px] col-span-1 ${
                      i === 24 || i === 25 ? "bg-[#F87171]" : "bg-[#10B981] "
                    } rounded-[3px]`}
                  />
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <h1 className="text-[14px] font-[500] text-[#52525B]">
                {item?.title}
              </h1>
              <div className="flex items-center gap-2">
                {icon && i === 0 && (
                  <Image src={icon} alt="icon" width={20} height={20} />
                )}
                <h1 className="text-[14px] font-[500] text-[#fff]">
                  {item?.value}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
