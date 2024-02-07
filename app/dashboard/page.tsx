import { CardWrapper } from "@/components/card-wrapper"
import { NodeCard } from "@/components/node-card"
import React from "react"

const Dashboard = () => {
  return (
    <CardWrapper>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
        {[1, 2, 3, 4, 5, 6]?.map((item) => <NodeCard key={item} />)}
      </div>
    </CardWrapper>
  )
}

export default Dashboard
