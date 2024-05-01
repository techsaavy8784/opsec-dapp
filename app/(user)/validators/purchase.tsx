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
import { Button } from "@/components/ui/button"
import {
  PurchaseModal,
  ValidatorData,
} from "@/components/validator-modal/purchase"
import { ValidatorNodeFilter } from "@/lib/constants"

const Purchase = () => {
  const [validatorId, setValidatorId] = useState(0)

  const { isFetching, data, refetch } = useQuery<ValidatorData[]>({
    queryKey: ["validator", "status", ValidatorNodeFilter.ALL_NODES],
    queryFn: () =>
      fetch(`/api/validator?status=${ValidatorNodeFilter.ALL_NODES}`).then(
        (res) => res.json(),
      ),
  })

  return (
    <div className="pt-5">
      <PurchaseModal
        onOpenChange={() => setValidatorId(0)}
        onPurchase={() => {
          refetch()
          setValidatorId(0)
        }}
        validator={data?.find((item) => item.id === validatorId)}
      />
      <p className="my-3">Pending Validator Nodes</p>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>You paid</TableHead>
              <TableHead>Rest price</TableHead>
              <TableHead></TableHead>
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
                  <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                    {item.restAmount}
                    {` `}
                    {item.validatorType.priceUnit}
                  </TableCell>
                  <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                    <Button onClick={() => setValidatorId(item.id)}>
                      Purchase
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default Purchase
