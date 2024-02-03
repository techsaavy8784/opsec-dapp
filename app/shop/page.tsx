import { CardWrapper } from "@/components/card-wrapper"
import { NodeCard } from "@/components/node-card"
import React from "react"

const Shop = () => {
  return (
    <CardWrapper>
      <div className="grid grid-cols-4 items-center gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => <NodeCard key={item} shop />)}
      </div>
    </CardWrapper>
  )
}

export default Shop
