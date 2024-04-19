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
import { Validator } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { NewValidatorPurchaseModal } from "@/components/validator-modal/new"
import { ExistValidatorPurchaseModal } from "@/components/validator-modal/extend"

const Purchase = () => {
  const [newModal, setNewModal] = useState<boolean>(false)
  const [extendModal, setExtendModal] = useState<boolean>(false)
  const [validatorID, setValidatorID] = useState<number>(-1)

  const { isFetching, data } = useQuery<
    (Validator & {
      validatorType: any
      restAmount: number
      paiedSumAmount: number
    })[]
  >({
    queryKey: ["pending-validator-node"],
    queryFn: () =>
      fetch(`/api/validator?status=${2}`).then((res) => res.json()),
  })

  const onExtendModal = (value: number) => {
    setValidatorID(value)
    setExtendModal(true)
  }

  return (
    <div className="pt-5">
      <Button
        className="float-right"
        onClick={() => setNewModal(true)}
        disabled={isFetching || !data || data.length === 0}
      >
        Purchase New Node
      </Button>
      <NewValidatorPurchaseModal
        open={newModal}
        onOpenChange={() => setNewModal((prev) => !prev)}
      />
      {validatorID !== -1 && (
        <ExistValidatorPurchaseModal
          open={extendModal}
          onOpenChange={() => setExtendModal((prev) => !prev)}
          validatorID={validatorID}
        />
      )}
      <p className="my-3">Pending Validator Nodes</p>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Full Amount</TableHead>
              <TableHead>Rest Amount</TableHead>
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
                    {item.restAmount}
                    {` `}
                    {item.validatorType.priceUnit}
                  </TableCell>
                  <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                    <Button onClick={() => onExtendModal(item.id)}>
                      Purchase Node
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
