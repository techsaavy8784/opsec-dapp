"use client"

import { ReloadIcon } from "@radix-ui/react-icons"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const Reward = () => {
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
    queryKey: ["reward-tax"],
    queryFn: () => fetch("/api/reward/tax").then((res) => res.json()),
  })

  const { mutate: claim, isPending: isClaiming } = useMutation({
    mutationFn: () =>
      fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        toast({ title: response.ok ? "Reward claimed" : "An error occured" })

        refetchValidatorReward()
        refetchReflectionReward()
        refetchTaxReward()
      }),
  })

  const totalReward =
    (validatorReward ?? 0) + (reflectionReward ?? 0) + (taxReward ?? 0)

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <p className="w-1/2 text-right text-gray-400">Validator Reward</p>
        <p>{validatorReward ?? 0}</p>
      </div>
      <div className="flex gap-4">
        <p className="w-1/2 text-right text-gray-400">Reflection Reward</p>
        <p>{reflectionReward ?? 0}</p>
      </div>
      <div className="flex gap-4">
        <p className="w-1/2 text-right text-gray-400">Tax Reward</p>
        <p>{taxReward ?? 0}</p>
      </div>
      <div className="flex gap-4">
        <p className="w-1/2 text-right text-gray-400">Total Claimable Amount</p>
        <p>{totalReward}</p>
      </div>
      <div className="text-center">
        <Button
          size="sm"
          onClick={() => claim()}
          disabled={isClaiming || totalReward === 0}
        >
          {isClaiming && <ReloadIcon className="mr-2 animate-spin" />}
          Claim
        </Button>
      </div>
    </div>
  )
}
export default Reward
