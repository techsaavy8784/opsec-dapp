"use client"

import React, { useCallback, useState } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import clsx from "clsx"
import { useWalletClient } from "wagmi"
import abi from "@/contract/abi.json"
import usePollStatus from "@/hooks/usePollStatus"
import { useToast } from "../ui/use-toast"

interface ExtendStakingModalProps extends DialogProps {
  stakeId: string
  onComplete: () => void
}

export const ExtendStakingModal: React.FC<ExtendStakingModalProps> = ({
  stakeId,
  onComplete,
  open,
  onOpenChange,
  ...props
}) => {
  const [month, setMonth] = useState(3)

  const { data: walletClient } = useWalletClient()

  const [pending, setPending] = useState(false)

  const { toast } = useToast()

  const { startPoll, stopPoll } = usePollStatus({
    cb: (stakeId: string, prevDuration: number) =>
      fetch(
        `/api/staking/extend/status?stakeId=${stakeId}&prevDuration=${prevDuration}`,
      )
        .then((res) => res.json())
        .then((res) => res.extended),
    stopWhen: (extended: boolean) => extended,
    onStop: () => {
      toast({ title: "Stake period has been extended" })
      onComplete()
    },
  })

  const handleExtendClick = useCallback(async () => {
    if (!walletClient) {
      return
    }

    try {
      setPending(true)

      const [duration] = await Promise.all([
        fetch(`/api/staking/extend/duration?stakeId=${stakeId}`).then((res) =>
          res.json(),
        ),
        walletClient.writeContract({
          address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
          abi,
          functionName: "extendUnlockTime",
          args: [stakeId, month * 31 * 3600 * 24],
        }),
      ])

      stopPoll()
      startPoll(stakeId, duration)
    } catch (e) {
      stopPoll()
      setPending(false)
      toast({
        title: "Failed to extend",
        description: JSON.stringify(e),
      })
    }
  }, [walletClient, stakeId, month, startPoll, stopPoll, toast])

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
      >
        <DialogTitle className="text-white text-center font-[600] text-[28px]">
          Extend your subscription by
        </DialogTitle>
        <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
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
        </DialogDescription>

        <Button
          type="button"
          onClick={handleExtendClick}
          variant="custom"
          disabled={pending}
        >
          {pending && <ReloadIcon className="mr-2 animate-spin" />}
          Extend Subscription
        </Button>
      </DialogContent>
    </Dialog>
  )
}
