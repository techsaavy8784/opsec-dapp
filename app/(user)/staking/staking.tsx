"use client"

import React, { useState } from "react"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import { useQuery } from "@tanstack/react-query"
import { NodeCard } from "@/components/node-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Staking from "@/components/staking-modal/staking"

const StakingPage: React.FC = () => {
  const [count, setCount] = useState<Record<string, number>>({})

  const { isPending, data, refetch } = useQuery<any>({
    queryKey: ["server/list"],
    queryFn: () => fetch("/api/server/list").then((res) => res.json()),
  })

  const entries = Object.entries(count)
    .filter(([chainId, amount]) => amount > 0)
    .sort((a, b) => Number(a[0]) - Number(b[0]))

  const countSum = entries.reduce((sum, [chainId, amount]) => sum + amount, 0)

  if (isPending) {
    return (
      <div className="grid items-center grid-cols-1 gap-8 pt-2 md:grid-cols-3">
        <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
        <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
        <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
      </div>
    )
  }

  if (!data) {
    return <>No data</>
  }

  return (
    <div className="space-y-6 text-center">
      <div className="grid items-center grid-cols-1 gap-8 pt-2 md:grid-cols-3">
        {data.chains.map((chain: any) => (
          <div key={chain.id}>
            <NodeCard
              key={chain.id}
              name={chain.name}
              description={chain.description}
              disabled={chain.available === 0}
            />
            <div className="flex gap-4 items-center mt-2 justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCount((prev) => ({
                    ...prev,
                    [chain.id]: (prev[chain.id] ?? 0) - 1,
                  }))
                }
                disabled={
                  count[chain.id] === 0 || count[chain.id] === undefined
                }
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span>{count[chain.id] ?? 0}</span>
              <Button
                variant="outline"
                size="icon"
                disabled={count[chain.id] === chain.available}
                onClick={() =>
                  setCount((prev) => ({
                    ...prev,
                    [chain.id]: (prev[chain.id] ?? 0) + 1,
                  }))
                }
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {countSum === 0 ? (
        <p>Please select reward nodes for your staking</p>
      ) : (
        <>
          <p>How long do you want to use these nodes?</p>
          <Staking chainAmounts={count} />
        </>
      )}
    </div>
  )
}

export default StakingPage
