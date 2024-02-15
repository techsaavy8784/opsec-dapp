"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Credit } from "@prisma/client"
import { CreditPaymentModal } from "@/components/payment-modal/credit"
import { Button } from "@/components/ui/button"

const CreditHistory = () => {
  const [modal, setModal] = useState(false)
  const { isPending, data, refetch } = useQuery<Credit[]>({
    queryKey: ["credits-history"],
    queryFn: () => fetch("/api/credits").then((res) => res.json()),
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
      <Button onClick={() => setModal(true)}>Charge Credits</Button>
      <CreditPaymentModal
        open={modal}
        onOpenChange={setModal}
        onComplete={refetch}
      />

      <p>Credit History</p>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>TX</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, key) => (
              <TableRow className="border-b-none" key={key}>
                <TableCell className="text-[16px] font-[600] text-white">
                  {key + 1}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                  {item.tx}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                  {item.credits}
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

export default CreditHistory
