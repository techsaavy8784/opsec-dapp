"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Payment } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { publicClient } from "@/contract/client"
import abi from "@/contract/abi.json"

const StakingHistory = () => {
  const { isPending, data } = useQuery<
    (Payment & { node: any; onchain: [number, number, number, number] })[]
  >({
    queryKey: ["staking-history"],
    queryFn: () => fetch("/api/staking").then((res) => res.json()),
  })

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
                <TableCell colSpan={5}>
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
                const remaining =
                  (item.duration -
                    (Date.now() - new Date(item.date).getTime()) / 1000) /
                  3600 /
                  24

                return (
                  <TableRow className="border-b-none" key={key}>
                    <TableCell className="text-[16px] font-[600] text-white">
                      {key + 1}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.node.blockchain.name}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.credit}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {Math.round(item.duration / 1000 / 3600 / 24)} days
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {remaining < 0 ? (
                        // todo: call contract unstake function
                        <Button>Unstake</Button>
                      ) : (
                        `${Math.max(0, remaining)} days`
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
