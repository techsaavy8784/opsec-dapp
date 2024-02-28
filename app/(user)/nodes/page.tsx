"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Blockchain, Node, Server } from "@prisma/client"
import { NodeCard } from "@/components/node-card"
import { formatDate } from "@/lib/utils"

export type NodeType = Node & { server: Server; blockchain: Blockchain }

const Nodes: React.FC = () => {
  const { isPending, data } = useQuery<NodeType[]>({
    queryKey: ["nodes/user"],
    queryFn: () => fetch("/api/nodes/user").then((res) => res.json()),
  })

  if (isPending) {
    return (
      <div className="grid items-center grid-cols-1 gap-8 pt-2 md:grid-cols-3">
        <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
        <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
        <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
      </div>
    )
  }

  return (
    <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-3">
      {data?.map((node, key) => (
        <NodeCard
          key={key}
          id={node.id}
          name={node.blockchain.name}
          created={formatDate(node.createdAt)}
          description={node.blockchain.description}
        />
      ))}
    </div>
  )
}

export default Nodes
