"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ReloadIcon } from "@radix-ui/react-icons"
import { formatUnits } from "viem"
import { useWalletClient } from "wagmi"
import { Payment } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { publicClient } from "@/contract/client"
import { formatDate } from "@/lib/utils"
import abi from "@/contract/abi.json"

const StakingHistory = () => {
  const { toast } = useToast()

  const { isPending, data } = useQuery<
    (Payment & { node: any; onchain: [number, number, number, number] })[]
  >({
    queryKey: ["staking-history"],
    queryFn: () => fetch("/api/staking").then((res) => res.json()),
  })

  const { data: staking, refetch } = useQuery({
    queryKey: ["staking-history-onchain"],
    queryFn: () =>
      Promise.all(
        data
          ? data.map((item) =>
              publicClient
                .readContract({
                  abi,
                  address: process.env
                    .NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
                  functionName: "stakes",
                  args: [item.stakeId],
                })
                .then(
                  (res) => res as [string, bigint, bigint, bigint, boolean],
                ),
            )
          : [],
      ),
  })

  const { data: walletClient } = useWalletClient()

  const [unstakeIds, setUnstakeIds] = useState<string[]>([])

  const handleUnstake = useCallback(
    async (stakeId: string) => {
      if (walletClient === undefined) {
        return
      }

      try {
        setUnstakeIds((prev) => prev.concat(stakeId))

        const hash = await walletClient.writeContract({
          abi,
          address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
          functionName: "unstake",
          args: [stakeId],
        })

        const tx = await publicClient.waitForTransactionReceipt({
          hash,
        })

        if (tx.status !== "success") {
          throw new Error("TX reverted")
        }

        refetch()

        toast({
          title: "Unstake has succeeded",
        })
      } catch (e) {
        toast({
          title: "Transaction failed",
        })
      } finally {
        setUnstakeIds((prev) =>
          prev.filter((unstakeId) => unstakeId !== stakeId),
        )
      }
    },
    [refetch, toast, walletClient],
  )

  useEffect(() => {
    refetch()
  }, [data, refetch])

  return (
    <div>
      <p className="my-3">Staking History</p>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Unlock remaining</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Skeleton className="rounded-lg w-full h-[64px] mr-2 block"></Skeleton>
                </TableCell>
              </TableRow>
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No Data
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, key) => {
                const remaining = Math.round(
                  item.duration -
                    (Date.now() - new Date(item.date).getTime()) /
                      1000 /
                      3600 /
                      24,
                )

                const unstakePending = unstakeIds.some(
                  (unstakeId) => unstakeId === item.stakeId,
                )

                return (
                  <TableRow className="border-b-none" key={key}>
                    <TableCell className="text-[16px] font-[600] text-white">
                      {key + 1}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.node.blockchain.name}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {staking?.[key]
                        ? formatUnits(staking[key][1], 18)
                        : undefined}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.duration} days
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {remaining >= 0 ? (
                        `${remaining} days`
                      ) : staking === undefined ? (
                        "0 days"
                      ) : staking[key]?.[4] ? (
                        "Unstaked"
                      ) : (
                        <Button
                          onClick={() => handleUnstake(item.stakeId!)}
                          disabled={unstakePending}
                        >
                          {unstakePending && (
                            <ReloadIcon className="mr-2 animate-spin" />
                          )}
                          Unstake
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {formatDate(item.date)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default StakingHistory
