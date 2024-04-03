"use client"

import React, { useCallback, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAccount, useReadContract, useWalletClient } from "wagmi"
import { generateRandomString } from "@/lib/utils"
import { formatUnits, parseUnits } from "viem"
import abi from "@/contract/abi.json"
import { useToast } from "../../../components/ui/use-toast"
import { erc20Abi } from "viem"
import { publicClient } from "@/contract/client"
import clsx from "clsx"
import { stakingRewardAmount } from "@/app/api/payment/subscriptions"
import { useQuery } from "@tanstack/react-query"
import usePollStatus from "@/hooks/usePollStatus"

const OPSEC_DECIMALS = 18

const Staking: React.FC = () => {
  const { address } = useAccount()

  const { data: opsecBalance, refetch: refetchBalance } = useReadContract({
    abi: erc20Abi,
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
    functionName: "allowance",
    args: [
      address as `0x${string}`,
      process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    ],
  })

  const { data: walletClient } = useWalletClient()

  const [month, setMonth] = useState(3)

  const [amount, setAmount] = useState(1)

  const [stakingStatus, setStakingStatus] = useState<"approving" | "staking">()

  const { toast } = useToast()

  const { refetch } = useQuery({
    queryKey: ["staking-progress"],
    queryFn: () => fetch("/api/staking/list").then((res) => res.json()),
  })

  const { startPoll, stopPoll } = usePollStatus({
    cb: (stakeId: string) =>
      fetch(`/api/staking/add/status?stakeId=${stakeId}`)
        .then((res) => res.json())
        .then((res) => res.added),
    stopWhen: (added: boolean) => added,
    onStop: () => {
      toast({ title: "Stake completed" })
      refetch()
    },
  })

  const handleStake = useCallback(async () => {
    if (walletClient === undefined || allowance === undefined) {
      return
    }

    try {
      const amountInUnit = parseUnits(String(amount), OPSEC_DECIMALS)

      if (allowance < amountInUnit) {
        setStakingStatus("approving")

        const hash = await walletClient.writeContract({
          address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
            amountInUnit,
          ],
        })

        const tx = await publicClient.waitForTransactionReceipt({
          hash,
        })

        if (tx.status !== "success") {
          throw new Error("TX reverted")
        }
      }

      setStakingStatus("staking")

      const encoder = new TextEncoder()
      const bytes = encoder.encode(generateRandomString(32))
      const stakeId = `0x${Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("")}`

      await walletClient.writeContract({
        address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
        abi,
        functionName: "stake",
        args: [stakeId, amountInUnit, month * 31 * 3600 * 24],
      })

      stopPoll()
      startPoll(stakeId)
    } catch (e) {
      stopPoll()
      setStakingStatus(undefined)
      toast({
        title: "Transaction failed",
        description: JSON.stringify(e),
      })
      return
    } finally {
      refetchBalance()
      refetchAllowance()
    }
  }, [
    allowance,
    amount,
    month,
    refetchAllowance,
    refetchBalance,
    startPoll,
    stopPoll,
    toast,
    walletClient,
  ])

  if (opsecBalance === undefined) {
    return null
  }

  return (
    <div className="text-center">
      <p>Staking period</p>
      <div className="flex gap-4 w-full max-w-96 m-auto mt-4">
        {[3, 6, 12].map((m) => (
          <div
            key={m}
            onClick={() => setMonth(m)}
            className={clsx(
              "border-[#F44336] w-1/3 border-solid border-2 px-3 py-12 cursor-pointer hover:border-red-700 text-center",
              m === month ? "border-green-400 bg-green-400" : null,
            )}
          >
            <p className="text-6xl">{m}</p>
            <p>Months</p>
          </div>
        ))}
      </div>

      <p className="mt-12">
        Stake {amount} $OPSEC
        <br />
        and you will get {stakingRewardAmount(amount)} nodes for reward
      </p>
      <Slider
        value={[amount]}
        min={1}
        max={Math.floor(Number(formatUnits(opsecBalance, OPSEC_DECIMALS)))}
        step={1}
        className="my-4"
        onValueChange={([value]) => setAmount(value)}
      />

      <Button
        onClick={handleStake}
        variant="custom"
        className="max-w-32 mt-12"
        disabled={stakingStatus !== undefined}
      >
        {stakingStatus !== undefined && (
          <ReloadIcon className="mr-2 animate-spin" />
        )}
        Stake
      </Button>

      {stakingStatus === "approving" && (
        <p className="text-gray-400 mt-4">
          Approving your $OPSEC balance to be handled by staking contract
        </p>
      )}
      {stakingStatus === "staking" && (
        <p className="text-gray-400 mt-4">Staking your $OPSEC balance</p>
      )}
    </div>
  )
}

export default Staking
