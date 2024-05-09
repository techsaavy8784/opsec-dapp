"use client"

import React, { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { NodeType } from "../page"
import usePollStatus from "@/hooks/usePollStatus"
import { NodeDetailCard } from "@/components/node-detail"

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

  return <NodeDetailCard data={data} refetch={refetch} />
}

export default Node
