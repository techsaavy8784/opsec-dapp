import { CardWrapper } from "@/components/card-wrapper"
import { NodeCard } from "@/components/node-card"
import React from "react"

const Dashboard = () => {
  return (
    <div className="max-md:px-4 m-0 p-0">
      <CardWrapper>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-8">
          {[1, 2, 3, 4, 5, 6]?.map((item) => <NodeCard key={item} />)}
        </div>
      </CardWrapper>
    </div>
  )
}

export default Dashboard
