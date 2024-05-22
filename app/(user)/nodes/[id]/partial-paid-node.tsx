import React from "react"
import { NodeType } from "@/app/(user)/nodes/page"

type Props = {
  node: NodeType
}

export const PartialNode: React.FC<Props> = ({ node }) => (
  <>
    <div className="flex items-center justify-between">
      <h1 className="text-[14px] font-[500] text-[#52525B]">Ownership</h1>
      <h1 className="text-[14px] font-[500] text-[#fff]">
        {node.ownership * 100} %
      </h1>
    </div>

    {!node.server && (
      <h1 className="text-[#fff] text-center pb-4">
        Waiting for admin to activate on server
      </h1>
    )}
  </>
)
