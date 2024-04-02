"use client"

import React, { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { formatUnits } from "viem"
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
import { publicClient } from "@/contract/client"
import { formatDate } from "@/lib/utils"
import abi from "@/contract/abi.json"

const StakingProgress = () => {
  const { isPending, data } = useQuery<
    (Payment & { node: any; onchain: [number, number, number, number] })[]
  >({
    queryKey: ["staking-progress"],
    queryFn: () => fetch("/api/staking/list").then((res) => res.json()),
  })

  const { data: staking, refetch } = useQuery({
    queryKey: ["staking-progress-onchain"],
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

  useEffect(() => {
    refetch()
  }, [data, refetch])

  if (!data || data.length === 0) {
    return null
  }

  return (
    <div>
      <p>Currently working on rewards for the following stakings</p>
      <hr className="my-4" />
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Stake Id</TableHead>
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
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px] flex gap-2">
                      {remaining} days
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

export default StakingProgress
