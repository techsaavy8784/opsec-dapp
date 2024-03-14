"use client"

import React, { useState } from "react"
import { MinusIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import { FileWarningIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { NodeCard } from "@/components/node-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { formatBalance } from "@/lib/utils"

const Staking: React.FC = () => {
  const [count, setCount] = useState<Record<string, number>>({})

  const [month, setMonth] = useState<number>(1)

  const { isPending, data, refetch } = useQuery<any>({
    queryKey: ["server/list"],
    queryFn: () => fetch("/api/server/list").then((res) => res.json()),
  })

  const { data: opsecBalance, refetch: refetchBalance } = useBalance({
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
  })

  const entries = Object.entries(count)
    .filter(([chainId, amount]) => amount > 0)
    .sort((a, b) => Number(a[0]) - Number(b[0]))

  const countSum = entries.reduce((sum, [chainId, amount]) => sum + amount, 0)

  const { data: stakingPerMonth } = useQuery<number | undefined>({
    queryKey: ["staking", JSON.stringify(entries)],
    queryFn: () =>
      fetch(
        `/api/staking/amount?chains=${entries.map(([chainId]) => chainId).join(",")}&amounts=${entries.map(([, amount]) => amount).join(",")}`,
      ).then((res) => res.json()),
  })

  const { data: hash, writeContract, isPending: isStaking } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const lowBalance =
    stakingPerMonth !== undefined &&
    opsecBalance !== undefined &&
    opsecBalance.value < stakingPerMonth * 10 ** opsecBalance.decimals * month

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
          <p>{month} months</p>
          <Slider
            value={[month]}
            max={12}
            min={1}
            step={1}
            onValueChange={([value]) => setMonth(value)}
          />
          {stakingPerMonth !== undefined && (
            <p>
              Stake {formatBalance(stakingPerMonth * month)} $OPSEC for {month}{" "}
              months
            </p>
          )}
          {lowBalance && (
            <p className="text-yellow-500">
              You don&lsquo;t have enough $OPSEC balance
            </p>
          )}
          <Button
            // onClick={handleStake}
            variant="custom"
            className="max-w-32"
            disabled={
              stakingPerMonth === undefined ||
              opsecBalance === undefined ||
              lowBalance
            }
          >
            {(isStaking || isConfirming || isRewarding) && (
              <ReloadIcon className="mr-2 animate-spin" />
            )}
            Stake
          </Button>{" "}
        </>
      )}
    </div>
  )
}

export default Staking
