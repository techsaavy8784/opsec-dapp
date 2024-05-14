"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Blockchain, Node, Payment, Server } from "@prisma/client"
import { NodeCard } from "@/components/node-card"
import { daysPassedSince, formatDate } from "@/lib/utils"

export type NodeType = Node & {
  blockchain: Blockchain
  payments: Payment[]
  server: Server
  ownership: number
  reward: number
}

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

  if (!Array.isArray(data)) {
    return <>No data</>
  }

  return (
    <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-3">
      {data?.map((node, key) => (
        <NodeCard
          key={key}
          id={node.id}
          name={node.blockchain.name}
          payType={node.blockchain.payType}
          created={formatDate(node.createdAt)}
          description={node.blockchain.description}
          status={node.status}
          expireInDays={
            node.payments.reduce((sum, item) => (sum += item.duration), 0) -
            daysPassedSince(node.createdAt)
          }
        />
      ))}
    </div>
  )
}

export default Nodes
