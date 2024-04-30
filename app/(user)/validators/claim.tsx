"use client"

import { ReloadIcon } from "@radix-ui/react-icons"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Validator } from "@prisma/client"
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
import { useToast } from "@/components/ui/use-toast"
import { ValidatorNodeFilter } from "@/lib/constants"

const Claim = () => {
  const { toast } = useToast()

  const { data, refetch, isFetching } = useQuery<{
    totalReward: number
    validators: Validator &
      {
        validatorType: any
        rewardAmount: number
      }[]
  }>({
    queryKey: ["validator-nodes-claim"],
    queryFn: () =>
      fetch(`/api/validators?status=${ValidatorNodeFilter.CLAIM_NODES}`).then(
        (res) => res.json(),
      ),
  })

  const { mutate: claim, isPending: isClaiming } = useMutation({
    mutationFn: () =>
      fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        if (response.ok) toast({ title: "Reward claimed" })
        else toast({ title: "An error occurred" })
        refetch()
      }),
  })

  return (
    <>
      <div className="w-full flex flex-row justify-between">
        <p className="my-3">Total Claimable Amount: {data?.totalReward || 0}</p>
        <Button size="sm" onClick={() => claim()} disabled={isClaiming}>
          {isClaiming && <ReloadIcon className="mr-2 animate-spin" />}
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
              <TableHead>Claimable Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton className="rounded-lg w-full h-[64px] mr-2 block"></Skeleton>
                </TableCell>
              </TableRow>
            ) : !data || data.validators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
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
