import { NodeCard } from "@/components/node-card"
import React from "react"

const Shop = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-white text-[22px] font-[600]">Available nodes</h1>
      </div>
      <div className="max-md:px-4 m-0 p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
            <NodeCard key={item} shop />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Shop
