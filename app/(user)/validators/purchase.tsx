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
import getRestAmount from "@/lib/getRestAmount"
import { Button } from "@/components/ui/button"
import { NewValidatorPurchaseModal } from "@/components/validator-modal/new"
import { ExistValidatorPurchaseModal } from "@/components/validator-modal/extend"

const Purchase = () => {
  const [newModal, setNewModal] = useState<boolean>(false)
  const [extendModal, setExtendModal] = useState<boolean>(false)

  const { isPending, data } = useQuery<
    (Validator & { validator_types: any })[]
  >({
    queryKey: ["pending-validator-node-notme"],
    queryFn: () =>
      fetch(`/api/validator?status=${2}`).then((res) => res.json()),
  })

  return (
    <div className="pt-5">
      <Button className="float-right" onClick={() => setNewModal(true)}>
        Purchase New Node
      </Button>
      <NewValidatorPurchaseModal
        open={newModal}
        onOpenChange={() => setNewModal((prev) => !prev)}
      />
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
            {isPending ? (
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
                <>
                  <TableRow className="border-b-none" key={key}>
                    <TableCell className="text-[16px] font-[600] text-white">
                      {key + 1}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.validator_types.name}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.validator_types.price}
                      {` `}
                      {item.validator_types.priceUnit}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {/* {await getRestAmount(item.id)} */}
                      {` `}
                      {item.validator_types.priceUnit}
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      <Button onClick={() => setExtendModal(true)}>
                        Purchase Node
                      </Button>
                    </TableCell>
                  </TableRow>
                  <ExistValidatorPurchaseModal
                    open={extendModal}
                    onOpenChange={() => setExtendModal((prev) => !prev)}
                    validatorID={item.id}
                  />
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default Purchase
