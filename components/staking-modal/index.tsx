import React, { useCallback, useState } from "react"
import { Blockchain } from "@prisma/client"
import { Dialog, DialogTitle, DialogContent } from "../ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DialogProps } from "@radix-ui/react-dialog"
import { Button } from "../ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi"
import { useToast } from "../ui/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { formatBalance } from "@/lib/utils"
import abi from "@/contract/abi.json"

interface StakingModalProps extends DialogProps {
  chain?: Blockchain
  nodeId?: number
  onStakingComplete: () => void
}

export const StakingModal: React.FC<StakingModalProps> = ({
  chain,
  nodeId,
  onOpenChange,
  onStakingComplete,
  ...props
}) => {
  const { address } = useAccount()
  const [month, setMonth] = useState(1)

  const { toast } = useToast()

  const router = useRouter()

  const { data: hash, writeContract, isPending: isStaking } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const { data: stakingPerMonth } = useQuery<number | undefined>({
    queryKey: ["staking", chain?.id],
    queryFn: () =>
      chain
        ? fetch(`/api/staking/amount?chains=${chain.id}&amounts=1`).then(
            (res) => res.json(),
          )
        : undefined,
  })

  const { data: opsecBalance, refetch: refetchBalance } = useBalance({
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
  })

  const lowBalance =
    stakingPerMonth !== undefined &&
    opsecBalance !== undefined &&
    opsecBalance.value < stakingPerMonth * 10 ** opsecBalance.decimals * month

  const { mutate: purchase, isPending: isRewarding } = useMutation({
    mutationFn: (verifier: string) =>
      fetch("/api/staking", {
        method: nodeId === undefined ? "POST" : "PUT",
        body: JSON.stringify({
          id: nodeId ?? chain?.id,
          verifier,
        }),
      }).then((response) => {
        onOpenChange?.(false)
        if (response.ok) {
          toast({
            title:
              nodeId === undefined
                ? "Node has been rewarded"
                : "Subscription extended",
          })
          response.json().then((res) => router.push(`/nodes/${res.nodeId}`))
        } else {
          toast({
            title: "An error occurred",
          })
        }
        onStakingComplete()
        refetchBalance()
      }),
  })

  const handleStake = useCallback(() => {
    if (stakingPerMonth === undefined || opsecBalance === undefined) {
      return
    }

    // todo: generate random hex string and pass it to verifier in the following contract call
    const stakeVerifier = ""

    writeContract({
      address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
      abi,
      functionName: "stake",
      args: [
        stakingPerMonth * month * 10 ** opsecBalance.decimals,
        month * 31 * 3600 * 24,
        stakeVerifier,
      ],
    })

    purchase(stakeVerifier)
  }, [month, opsecBalance, purchase, stakingPerMonth, writeContract])

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      {chain && (
        <DialogContent
          className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
        >
          <DialogTitle className="text-white text-center font-[600] text-[28px]">
            Stake for reward
          </DialogTitle>
          <div className="text-[#54597C] w-full text-center font-[500] text-[16px] space-y-4">
            <Image
              src={`/icons/blockchain/${chain.name
                .toLowerCase()
                .replace(/ /g, "-")}.png`}
              alt=""
              width={64}
              height={64}
              className="m-auto"
            />
            <p>
              {nodeId
                ? "How long do you want to extend the subscription by?"
                : "How long do you want to use this node?"}
            </p>
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
                Stake {formatBalance(stakingPerMonth * month)} $OPSEC for{" "}
                {month} months
              </p>
            )}
            {lowBalance && <p>You don&lsquo;t have enough $OPSEC balance</p>}
            <Button
              onClick={handleStake}
              variant="custom"
              disabled={
                stakingPerMonth === undefined ||
                opsecBalance === undefined ||
                lowBalance
              }
            >
              {(isStaking || isConfirming || isRewarding) && (
                <ReloadIcon className="mr-2 animate-spin" />
              )}
              Stake
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
