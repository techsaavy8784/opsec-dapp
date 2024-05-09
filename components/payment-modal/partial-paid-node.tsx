"use client"

import React, { useEffect, useState } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import { Blockchain } from "@prisma/client"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "../ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"
import { Slider } from "@/components/ui/slider"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "../ui/use-toast"
import { useRouter } from "next/navigation"

interface PaymentModalProps extends DialogProps {
  open: boolean
  chain?: Blockchain
  onPurchaseComplete: () => void
}

export const PartialNodePaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onPurchaseComplete,
  chain,
  onOpenChange,
  ...props
}) => {
  const [amount, setAmount] = useState(chain?.floorPrice ?? 0)

  const { toast } = useToast()

  const { data: balance, refetch: refetchBalance } = useQuery({
    queryKey: ["credits/balance"],
    queryFn: () => fetch("/api/credits/balance").then((res) => res.json()),
  })

  useEffect(() => {
    setAmount(chain?.floorPrice ?? 0)
  }, [open])

  const insufficientBalance = Number(balance?.balance) < Number(amount)

  const { mutate: purchase, isPending: isPaying } = useMutation({
    mutationFn: (wallet: string) =>
      fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({
          wallet,
          id: chain?.id,
          payAmount: amount,
        }),
      }).then((response) => {
        onOpenChange?.(false)
        if (response.ok) {
          toast({
            title: "Node purchased",
          })
        } else {
          toast({
            title: "An error occurred",
          })
        }
        onPurchaseComplete()
        refetchBalance()
      }),
  })

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      {chain && (
        <DialogContent className="bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]">
          <DialogTitle className="text-white text-center font-[600] text-[28px]">
            Buy a node
          </DialogTitle>
          <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
            <div className="flex flex-col items-center gap-4">
              <Image
                src={`/icons/blockchain/${chain.name
                  .toLowerCase()
                  .replace(/ /g, "-")}.png`}
                alt=""
                width={64}
                height={64}
                className="mt-10 mb-4"
              />
            </div>
          </DialogDescription>

          {insufficientBalance && (
            <p className="text-center text-yellow-600">
              Insufficient credit balance
            </p>
          )}

          <form className="flex flex-col items-center justify-center gap-8 px-8">
            <Slider
              value={[amount]}
              min={chain.floorPrice ?? 1}
              max={chain.price}
              step={1}
              className="my-4"
              onValueChange={([value]) => setAmount(value)}
            />
            <p className="text-[#F44336]">
              <strong>Chain Price: </strong>
              <span className="text-zinc-500">{chain.price}</span>
            </p>
            <p className="text-[#F44336]">
              <strong>%Ownership: </strong>
              <span className="text-zinc-500">
                {Math.floor((amount * 100) / chain.price)}
                {" %"}
              </span>
            </p>
            <Button
              type="button"
              onClick={() => purchase(chain.rewardWallet ?? "")}
              variant="custom"
              disabled={isPaying || insufficientBalance}
            >
              {isPaying && <ReloadIcon className="mr-2 animate-spin" />}
              Purchase
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
