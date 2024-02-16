"use client"

import React, { useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { NodeCard } from "@/components/node-card"
import { NodePaymentModal } from "@/components/payment-modal/node"
import { Blockchain } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

const Nodes: React.FC = () => {
  const [chain, setChain] = useState<Blockchain>()

  const timer = useRef<NodeJS.Timeout>()

  const { toast } = useToast()

  const { isPending, data, refetch } = useQuery<[]>({
    queryKey: ["server/list"],
    queryFn: () => fetch("/api/server/list").then((res) => res.json()),
  })

  const { data: balance } = useQuery({
    queryKey: ["credits/balance"],
    queryFn: () => fetch("api/credits/balance").then((res) => res.json()),
  })

  const { mutate } = useMutation({
    mutationFn: (wallet) =>
      fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({
          wallet,
          blockchainId: chain?.id,
          duration: 1,
        }),
      }).then(() => {
        setChain(undefined)
        toast({
          title: "Node purchased",
        })
        refetch()
      }),
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
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 pt-2">
          <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
          <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
          <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
        </div>
      </>
    )
  }

  if (!data) {
    return "No data"
  }

  return (
    <>
      <div className="pb-6">
        <div className="w-full flex px-[20px] md:px-[34px] py-6 rounded-[24px] justify-center flex-col bg-[url(/backgrounds/marketplace.jpg)] bg-center bg-cover bg-no-repeat h-[172px]">
          <h1 className="uppercase text-[32px] font-[900]">{data.length}</h1>
          <h1 className="uppercase text-md font-[300]">nodes available</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 pt-2">
        {data.map((chain: any) => (
          <NodeCard
            key={chain.id}
            name={chain.name}
            description={chain.description}
            onRunNodeClick={() => setChain(chain)}
          />
        ))}
        <NodePaymentModal
          open={!!chain}
          chain={chain}
          onOpenChange={(open) => {
            setChain(undefined)
            if (!open) {
              clearInterval(timer.current)
            }
          }}
          insufficientBalance={Number(balance?.balance) < Number(chain?.price)}
          onPay={mutate}
        />
      </div>
    </>
  )
}

export default Nodes
