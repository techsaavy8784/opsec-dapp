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

const BillingHistory = () => {
  const { isPending, data } = useQuery<Payment[]>({
    queryKey: ["payment-history"],
    queryFn: () => fetch("/api/payment").then((res) => res.json()),
  })

  if (isPending) {
    return (
      <Skeleton className="rounded-lg w-full h-[64px] mr-2 block"></Skeleton>
    )
  }

  if (!data) {
    return "No data"
  }

  return (
    <div>
      <p>Billing History</p>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item, key) => (
              <TableRow className="border-b-none" key={key}>
                <TableCell className="text-[16px] font-[600] text-white">
                  {key + 1}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                  {item.node.server.blockchain.name}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                  {item.duration}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                  {item.credit}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                  {item.date.toISOString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default BillingHistory
