"use client"

import React from "react"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Page A",
    pv: 2400,
  },
  {
    name: "Page B",
    pv: 1398,
  },
  {
    name: "Page C",
    pv: 9800,
  },
  {
    name: "Page D",
    pv: 3908,
  },
  {
    name: "Page E",
    pv: 6800,
  },
  {
    name: "Page F",
    pv: 4800,
  },
  {
    name: "Page G",
    pv: 8300,
  },
]

const TreasuryChart = () => {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="25%" stopColor="#F4433640" stopOpacity={1} />
            <stop offset="95%" stopColor="#F4433600" stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={["auto", "auto"]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="pv"
          stroke="#F44336"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPv)"
          dot={{ stroke: "#F44336", strokeWidth: 2, fill: "#fff", r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export { TreasuryChart }
