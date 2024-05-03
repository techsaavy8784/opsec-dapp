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
import { Skeleton } from "@/components/ui/skeleton"
import { ValidatorStatus } from "@/lib/constants"
import { ValidatorData } from "@/components/validator-modal/purchase"

const ValidatorList = () => {
  const { data, isFetching } = useQuery<ValidatorData[]>({
    queryKey: ["Validator", ValidatorStatus.RUNNING],
    queryFn: () =>
      fetch(`/api/validator?status=${ValidatorStatus.RUNNING}`).then((res) =>
        res.json(),
      ),
  })

  return (
    <div className="border border-[#FFFFFF33] rounded-[16px]">
      <Table>
        <TableHeader>
          <TableRow className="border-b-[#FFFFFF4D]">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">You paid</TableHead>
            <TableHead className="text-right">% Ownership</TableHead>
            <TableHead className="text-right">Reward</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Skeleton className="rounded-lg w-full h-[64px] mr-2 block"></Skeleton>
              </TableCell>
            </TableRow>
          ) : !data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No Data
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, key) => (
              <TableRow className="border-b-none" key={key}>
                <TableCell className="text-[16px] font-[600] text-white">
                  {key + 1}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                  {item.validatorType.name}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px] text-right">
                  {item.validatorType.price}
                  {` `}
                  {item.validatorType.priceUnit}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px] text-right">
                  {item.mepaidAmount}
                  {` `}
                  {item.validatorType.priceUnit}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px] text-right">
                  {item.ownership * 100}
                </TableCell>
                <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px] text-right">
                  {item.rewardAmount}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ValidatorList
