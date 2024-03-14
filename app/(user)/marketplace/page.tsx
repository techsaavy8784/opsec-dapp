"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { NodeCard } from "@/components/node-card"
import { NodePaymentModal } from "@/components/payment-modal/node"
import { Blockchain } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"

const Nodes: React.FC = () => {
  const [chain, setChain] = useState<Blockchain>()

  const { isPending, data, refetch } = useQuery<any>({
    queryKey: ["server/list"],
    queryFn: () => fetch("/api/server/list").then((res) => res.json()),
  })

  if (isPending) {
    return (
      <>
        <div className="pb-6">
          <div className="w-full flex px-[20px] md:px-[34px] py-6 rounded-[24px] justify-center flex-col bg-[url(/backgrounds/marketplace.jpg)] bg-center bg-cover bg-no-repeat h-[172px]">
            <Skeleton className="rounded-lg w-[12px] h-[32px] mr-2 block"></Skeleton>
            <h1 className="uppercase text-md font-[300]">nodes available</h1>
          </div>
        </div>
        <div className="grid items-center grid-cols-1 gap-8 pt-2 md:grid-cols-3">
          <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
          <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
          <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
        </div>
      </>
    )
  }

  if (!data) {
    return <>No data</>
  }

  return (
    <>
      <div className="pb-6">
        <div className="w-full flex px-[20px] md:px-[34px] py-6 rounded-[24px] justify-center flex-col bg-[url(/backgrounds/marketplace.jpg)] bg-center bg-cover bg-no-repeat h-[172px]">
          <h1 className="uppercase text-[32px] font-[900]">{data.capacity}</h1>
          <h1 className="uppercase text-md font-[300]">nodes available</h1>
        </div>
      </div>
      <div className="grid items-center grid-cols-1 gap-8 pt-2 md:grid-cols-3">
        {data.chains.map((chain: any) => (
          <NodeCard
            key={chain.id}
            name={chain.name}
            description={chain.description}
            onBuy={() => setChain(chain)}
            disabled={chain.available === 0}
          />
        ))}
        <NodePaymentModal
          open={!!chain}
          chain={chain}
          onOpenChange={() => setChain(undefined)}
          onPurchaseComplete={() => refetch()}
        />
      </div>
    </>
  )
}

export default Nodes
