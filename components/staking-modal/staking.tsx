"use client"

import React, { useCallback, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { formatBalance, generateRandomString } from "@/lib/utils"
import abi from "@/contract/abi.json"

interface StakingProps {
  rewards: Record<string, number>
  nodeId?: number
  onStakingComplete: () => void
}

const Staking: React.FC<StakingProps> = ({
  rewards,
  nodeId,
  onStakingComplete,
}) => {
  const [month, setMonth] = useState<number>(1)

  const { data: opsecBalance, refetch: refetchBalance } = useBalance({
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
  })

  const entries = Object.entries(rewards)
    .filter(([chainId, amount]) => amount > 0)
    .sort((a, b) => Number(a[0]) - Number(b[0]))

  const chains = entries.map(([chainId]) => chainId)

  const amounts = entries.map(([, amount]) => amount)

  const { data: stakingPerMonth } = useQuery<number | undefined>({
    queryKey: ["staking", JSON.stringify(entries)],
    queryFn: () =>
      fetch(
        `/api/staking/amount?chains=${chains.join(",")}&amounts=${amounts.join(",")}`,
      ).then((res) => res.json()),
  })

  const { mutateAsync: registerStaking, isPending: isRegistering } =
    useMutation({
      mutationFn: (stakeId: string) =>
        nodeId === undefined
          ? fetch("/api/staking/register", {
              method: "POST",
              body: JSON.stringify({
                stakeId,
                rewards,
              }),
            })
          : fetch("/api/staking/register", {
              method: "PUT",
              body: JSON.stringify({
                stakeId,
                nodeId,
              }),
            }),
    })

  const { data: hash, writeContract, isPending: isStaking } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleStake = useCallback(() => {
    if (stakingPerMonth === undefined || opsecBalance === undefined) {
      return
    }

    const stakeId = generateRandomString(32)
    const encoder = new TextEncoder()
    const bytes = encoder.encode(stakeId)
    const bytesString = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("")

    registerStaking(stakeId).then(() =>
      writeContract({
        address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
        abi,
        functionName: "stake",
        args: [
          bytesString,
          stakingPerMonth * month * 10 ** opsecBalance.decimals,
          month * 31 * 3600 * 24,
        ],
      }),
    )
  }, [month, opsecBalance, registerStaking, stakingPerMonth, writeContract])

  const lowBalance =
    stakingPerMonth !== undefined &&
    opsecBalance !== undefined &&
    opsecBalance.value < stakingPerMonth * 10 ** opsecBalance.decimals * month

  const isPending = isRegistering || isStaking || isConfirming

  return (
    <div className="space-y-4">
      <p>{month} months</p>
      <Slider
        value={[month]}
        max={12}
        min={1}
        step={1}
        onValueChange={([value]) => setMonth(value)}
      />
      {stakingPerMonth !== undefined && (
        <p>
          Stake {formatBalance(stakingPerMonth * month)} $OPSEC for {month}{" "}
          months
        </p>
      )}
      {lowBalance && (
        <p className="text-yellow-500">
          You don&lsquo;t have enough $OPSEC balance
        </p>
      )}
      <Button
        onClick={handleStake}
        variant="custom"
        className="max-w-32"
        disabled={
          isPending ||
          stakingPerMonth === undefined ||
          opsecBalance === undefined ||
          lowBalance
        }
      >
        {isPending && <ReloadIcon className="mr-2 animate-spin" />}
        Stake
      </Button>{" "}
    </div>
  )
}

export default Staking
