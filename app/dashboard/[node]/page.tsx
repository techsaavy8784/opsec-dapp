import { CardWrapper } from "@/components/card-wrapper"
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
const staked = [
  {
    title: "OP Staked",
    value: "8,995 OP",
  },
  {
    title: "Staked Address",
    value: "0xF98e21..b1EdCa4143",
  },
  {
    title: "Stake Requirement",
    value: "5,000 OP",
  },
]
const reward = [
  {
    title: "Earning",
    value: "120 OP",
  },
  {
    title: "Last payout",
    value: "-",
  },
  {
    title: "Lifetime earning",
    value: "-",
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
    <CardWrapper>
      <div className="grid grid-cols-3 items-center gap-10">
        <div className="col-span-1">
          <NodeData active title="Nodes Stats" stats={node} />
        </div>
        <div className="col-span-1">
          <NodeData title="Staked OP" stats={staked} />
        </div>
        <div className="col-span-1">
          <NodeData title="Reward OP" stats={reward} />
        </div>
      </div>
      <div className="grid grid-cols-4 pt-10">
        <div className="col-span-4">
          <NodeData
            title="Nodes Stats"
            active
            uptime={"93.63"}
            stats={uptime}
          />
        </div>
      </div>
    </CardWrapper>
  )
}

export default Node
