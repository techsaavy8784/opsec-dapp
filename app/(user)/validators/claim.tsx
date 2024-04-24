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
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"
import { ReloadIcon } from "@radix-ui/react-icons"
import { ValidatorNodeFilter } from "@/lib/constants"
import dayjs from "dayjs"

const Claim = () => {
  const [claimIds, setClaimIds] = useState<number[]>([])

  const { data, refetch, isFetching } = useQuery<
    (Validator & {
      validatorType: any
      restAmount: number
      paidSumAmount: number
      mepaidAmount: number
      claimed: boolean
      claim: any
    })[]
  >({
    queryKey: ["Validator-nodess"],
    queryFn: () =>
      fetch(`/api/validator?status=${ValidatorNodeFilter.CLAIM_NODES}`).then(
        (res) => res.json(),
      ),
  })

  const handleClaimClick = useCallback(
    async (id: number, amount: number) => {
      if (!data || data.length === 0) return

      setClaimIds((prev) => prev.concat(id))

      const ethPrice = await getUSDAmountForETH()
      await fetch("/api/claim/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount / ethPrice, validatorId: id }),
      })

      refetch()
      setClaimIds((prev) => prev.filter((claimId) => claimId !== id))
    },
    [data, refetch],
  )

  return (
    <>
      <p className="my-3">Pending Validator Nodes</p>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Full Amount</TableHead>
              <TableHead>You Paied Amount</TableHead>
              <TableHead>Claimable Amount</TableHead>
              <TableHead></TableHead>
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
                <TableCell colSpan={6} className="text-center">
                  No Data
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, key) => {
                const rewardPercent = item.mepaidAmount / item.paidSumAmount
                const lockTime = dayjs(item.purchaseTime).add(
                  item.validatorType.rewardLockTime,
                  "day",
                )
                const now = dayjs()
                const rewardPeriod =
                  item.validatorType.rewardLockTime / 30 +
                  now.diff(lockTime, "month") -
                  (item.claim
                    ? now.diff(dayjs(item.claim.lasted_at), "month")
                    : 0)
                const claimableAmount =
                  rewardPercent *
                  item.validatorType.rewardPerMonth *
                  rewardPeriod
                const claimPending = claimIds.some(
                  (claimId) => claimId === item.id,
                )
                return (
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
                      {claimableAmount} USD
                    </TableCell>
                    <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                      {item.claimed ? (
                        "Claimed"
                      ) : (
                        <Button
                          onClick={() =>
                            handleClaimClick(item.id, claimableAmount)
                          }
                          disabled={claimPending}
                        >
                          {claimPending && (
                            <ReloadIcon className="mr-2 animate-spin" />
                          )}
                          Claim
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
export default Claim
