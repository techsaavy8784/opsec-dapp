"use client"

import React, { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { PAY_TYPE } from "@prisma/client"
import usePollStatus from "@/hooks/usePollStatus"
import { NodeType } from "@/app/(user)/nodes/page"
import { Skeleton } from "@/components/ui/skeleton"
import { FullNode } from "./FullNode"
import { PartialNode } from "./PartialNode"

interface NodeProps {
  params: {
    id: string
  }
}

const Node: React.FC<NodeProps> = ({ params: { id } }) => {
  const { isPending, data, refetch } = useQuery<NodeType>({
    queryKey: [`nodes/${id}`],
    queryFn: () => fetch(`/api/nodes/${id}`).then((res) => res.json()),
  })

  const { startPoll } = usePollStatus({
    cb: () => refetch(),
    stopWhen: () => data?.status === "LIVE",
    interval: 10000,
  })

  useEffect(() => {
    if (data?.status !== "LIVE") {
      startPoll()
    }
  }, [data?.status, startPoll])

  if (isPending || !data) {
    return (
      <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
    )
  }

  return (
    <>
      {data.blockchain.payType === PAY_TYPE.FULL && (
        <FullNode node={data} refetch={refetch} />
      )}
      {data.blockchain.payType === PAY_TYPE.PARTIAL && (
        <PartialNode node={data} />
      )}
    </>
  )
}

export default Node
