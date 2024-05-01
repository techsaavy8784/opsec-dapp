"use client"

import { useMemo } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const Claim = () => {
  const { toast } = useToast()

  const { data: validatorReward, refetch: refetchValidatorReward } =
    useQuery<number>({
      queryKey: ["reward-validator"],
      queryFn: () => fetch("/api/reward/validator").then((res) => res.json()),
    })

  const { data: reflectionReward, refetch: refetchReflectionReward } =
    useQuery<number>({
      queryKey: ["reward-reflection"],
      queryFn: () => fetch("/api/reward/reflection").then((res) => res.json()),
    })

  const { data: taxReward, refetch: refetchTaxReward } = useQuery<number>({
    queryKey: ["tax-reward"],
    queryFn: () => fetch("/api/reward/tax").then((res) => res.json()),
  })

  const { mutate: claim, isPending: isClaiming } = useMutation({
    mutationFn: () =>
      fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        if (response.ok) toast({ title: "Reward claimed" })
        else toast({ title: "An error occurred" })
        refetchValidatorReward()
        refetchReflectionReward()
        refetchTaxReward()
      }),
  })

  const totalReward = useMemo(
    () => (validatorReward || 0) + (reflectionReward || 0) + (taxReward || 0),
    [reflectionReward, taxReward, validatorReward],
  )

  return (
    <>
      <div className="w-full flex flex-row justify-between my-3">
        <p>Validator Reward: {validatorReward || 0}</p>
        <p>Reflection Reward: {reflectionReward || 0}</p>
        <p>Tax Reward: {taxReward || 0}</p>
      </div>
      <div className="w-full flex flex-row justify-between">
        <p className="my-3">Total Claimable Amount: {totalReward || 0}</p>
        <Button size="sm" onClick={() => claim()} disabled={isClaiming}>
          {isClaiming && <ReloadIcon className="mr-2 animate-spin" />}
          Claim
        </Button>
      </div>
    </>
  )
}
export default Claim
