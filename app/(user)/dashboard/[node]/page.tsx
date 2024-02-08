import { NodeData } from "@/components/node-data"
import React from "react"

const node = [
  {
    title: "Total time validating",
    value: "23mins",
  },
  {
    title: "Time last active",
    value: "2d ago",
  },
  {
    title: "Last rotation index",
    value: "1.5hrs",
  },
]

const uptime = [
  {
    title: "Name",
    value: "Bittensor",
  },
  {
    title: "Activated date",
    value: "2d ago",
  },
  {
    title: "90 days ago",
    value: "Today",
  },
]

const Node = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center">
        <div className="col-span-3">
          <NodeData active title="Nodes Stats" stats={node} />
        </div>
      </div>
      <h1 className="text-white font-[600] text-[28px] ml-2">My Nodes</h1>
      <div className="grid grid-cols-4">
        <div className="col-span-4">
          <NodeData
            icon="/icons/celestia-node.svg"
            title="Nodes Stats"
            uptime={"93.63"}
            stats={uptime}
          />
        </div>
      </div>
    </div>
  )
}

export default Node
