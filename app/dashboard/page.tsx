import { CardWrapper } from "@/components/card-wrapper"
import { NodeCard } from "@/components/node-card"
import React from "react"

const Dashboard = () => {
  return (
    <CardWrapper>
      <div className="grid grid-cols-4 items-center gap-8">
        <NodeCard />
        <NodeCard />
        <NodeCard />
        <NodeCard />
      </div>
    </CardWrapper>
  )
}

export default Dashboard
