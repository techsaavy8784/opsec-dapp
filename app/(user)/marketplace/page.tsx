"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { NodeCard } from "@/components/node-card"
import { NodePaymentModal } from "@/components/payment-modal/full-paid-node"
import { PartialNodePaymentModal } from "@/components/payment-modal/partial-paid-node"
import { Blockchain } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { PAY_TYPE } from "@prisma/client"

type Type = {
  total: number
  capacity: number
  chains: (Blockchain & { disabled: boolean })[]
}

type ComingSoonChain = {
  id: number
  name: string
  description: string
}

const comingChains: ComingSoonChain[] = [
  {
    id: 0,
    name: "XAI",
    description:
      "With Xai, potentially billions of traditional gamers can own and trade valuable in-game items in their favorite games for the first time, without the need to interact with crypto-wallets.",
  },
  {
    id: 1,
    name: "Myria",
    description:
      "Myria is a gaming ecosystem powered by Myria's Ethereum L2 scaling solution.",
  },
  {
    id: 2,
    name: "Streamr",
    description:
      "Decentralized data broadcasting. Streamr hyperscales live data for AI, video & DePIN via secure P2P distribution. $DATA. Build with us: http://linktr.ee/Streamr",
  },
  {
    id: 3,
    name: "Nexis",
    description:
      "A layer-1 data infrastructure built with the speed, scalability, and affordability to power the future of decentralized Artificial Intelligence (AI) blockchain predictions. Welcome to the Nexis era",
  },
  {
    id: 4,
    name: "Cartesi",
    description: "Scaling Computation. Transcending EVM Limitations.",
  },
]

const Nodes: React.FC = () => {
  const [chain, setChain] = useState<Blockchain>()

  const { isPending, data, refetch } = useQuery<Type>({
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
        {data.chains.map((chain) => (
          <NodeCard
            key={chain.id}
            name={chain.name}
            description={chain.description}
            payType={chain.payType}
            onBuy={() => setChain(chain)}
            disabled={chain.disabled}
          />
        ))}
        {comingChains.map((chain) => (
          <NodeCard
            key={chain.id}
            name={chain.name}
            description={chain.description}
            isComing={true}
          />
        ))}
        <NodePaymentModal
          open={!!chain && chain.payType === PAY_TYPE.FULL}
          chain={chain}
          onOpenChange={() => setChain(undefined)}
          onPurchaseComplete={() => refetch()}
        />
        <PartialNodePaymentModal
          open={!!chain && chain.payType === PAY_TYPE.PARTIAL}
          chain={chain}
          onOpenChange={() => setChain(undefined)}
          onPurchaseComplete={() => refetch()}
        />
      </div>
    </>
  )
}

export default Nodes
