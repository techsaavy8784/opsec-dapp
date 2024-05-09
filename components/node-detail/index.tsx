"use client"

import { NodeType } from "@/app/(user)/nodes/page"
import { PAY_TYPE } from "@prisma/client"
import { FullNode } from "./FullNode"
import { PartialNode } from "./PartialNode"

type Props = {
  data: NodeType
  refetch: () => void
}

export const NodeDetailCard: React.FC<Props> = ({ data, refetch }) => {
  return (
    <>
      {data.blockchain.payType === PAY_TYPE.FULL && (
        <FullNode data={data} refetch={refetch} />
      )}
      {data.blockchain.payType === PAY_TYPE.PARTIAL && (
        <PartialNode data={data} />
      )}
    </>
  )
}
