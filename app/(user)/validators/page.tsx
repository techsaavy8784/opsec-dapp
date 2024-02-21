import { NodeCard } from "@/components/node-card"
import React from "react"

const Validators = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-white text-[22px] font-[600]">Choose validator</h1>
      </div>
      <div className="max-md:px-4 m-0 p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-8"></div>
      </div>
    </div>
  )
}

export default Validators
