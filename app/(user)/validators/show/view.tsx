"use client"
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
import { Validator } from "@prisma/client"
import React, { useEffect } from "react"
import { ValidatorNodeFilter } from "@/lib/constants"

interface ViewValidatorStatusProsp {
  status: ValidatorNodeFilter
}

const ViewValidatorStatus: React.FC<ViewValidatorStatusProsp> = ({
  status,
}) => {
  const { data, isFetching } = useQuery<
    (Validator & {
      validatorType: any
      restAmount: number
      paidSumAmount: number
      mepaidAmount: number
      rewardAmount: number
    })[]
  >({
    queryKey: ["Validator", "status", status],
    queryFn: () =>
      fetch(`/api/validator?status=${status}`).then((res) => res.json()),
  })

  return (
    <>
      <p className="my-3">Pending Validator Nodes</p>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>You paid</TableHead>
              <TableHead>
                {status === ValidatorNodeFilter.FULLY_PURCHASED_NODES
                  ? "Reward"
                  : "Rest price"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={5}>
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
                  <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                    {item.validatorType.price}
                    {` `}
                    {item.validatorType.priceUnit}
                  </TableCell>
                  <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                    {item.mepaidAmount}
                    {` `}
                    {item.validatorType.priceUnit}
                  </TableCell>
                  {status !== ValidatorNodeFilter.FULLY_PURCHASED_NODES && (
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.restAmount}
                      {` `}
                      {item.validatorType.priceUnit}
                    </TableCell>
                  )}
                  {status === ValidatorNodeFilter.FULLY_PURCHASED_NODES && (
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.rewardAmount}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default ViewValidatorStatus
