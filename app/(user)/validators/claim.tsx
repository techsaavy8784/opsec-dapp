"use client"

import { useCallback, useState } from "react"
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
import { Validator } from "@prisma/client"
import { ReloadIcon } from "@radix-ui/react-icons"

const Claim = () => {
  const [claiming, setClaiming] = useState(false)

  const { data, refetch, isFetching } = useQuery<{
    totalReward: number
    validators: Validator &
      {
        validatorType: any
        paidSumAmount: number
        mepaidAmount: number
        rewardAmount: number
      }[]
  }>({
    queryKey: ["validator-nodes-claim"],
    queryFn: () => fetch(`/api/reward/validator`).then((res) => res.json()),
  })

  const handleClaimClick = useCallback(async () => {
    if (!data || data.length === 0) return

    setClaiming(true)

    await fetch("/api/reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    refetch()
    setClaiming(false)
  }, [data, refetch])

  return (
    <>
      <div className="w-full flex flex-row justify-between">
        <p className="my-3">Total Claimable Amount: {data?.totalReward || 0}</p>
        <Button
          size="sm"
          onClick={() => handleClaimClick()}
          disabled={claiming || data?.totalReward === 0}
        >
          {claiming && <ReloadIcon className="mr-2 animate-spin" />}
          Claim
        </Button>
      </div>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Full Amount</TableHead>
              <TableHead>You Paied Amount</TableHead>
              <TableHead>Claimable Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Skeleton className="rounded-lg w-full h-[64px] mr-2 block"></Skeleton>
                </TableCell>
              </TableRow>
            ) : !data || data.validators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No Data
                </TableCell>
              </TableRow>
            ) : (
              data.validators.map((item, key) => (
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
                    {item.rewardAmount} USD
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
export default Claim
