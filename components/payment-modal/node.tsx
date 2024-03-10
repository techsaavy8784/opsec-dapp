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
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "../ui/use-toast"
import clsx from "clsx"
import subscriptions from "@/app/api/payment/subscriptions"
import { redirect, useRouter } from "next/navigation"

interface PaymentModalProps extends DialogProps {
  open: boolean
  nodeId?: number
  chain?: Blockchain
  onPurchaseComplete: () => void
}

export const NodePaymentModal: React.FC<PaymentModalProps> = ({
  open,
  nodeId,
  onPurchaseComplete,
  chain,
  onOpenChange,
  ...props
}) => {
  const [walletAddr, setWalletAddr] = useState("")

  const [plan, setPlan] = useState(0)

  const { toast } = useToast()

  const router = useRouter()

  const { data: balance, refetch: refetchBalance } = useQuery({
    queryKey: ["credits/balance"],
    queryFn: () => fetch("/api/credits/balance").then((res) => res.json()),
  })

  useEffect(() => {
    setPlan(0)
    setWalletAddr("")
  }, [open])

  const [, priceMultiplier] = subscriptions[plan]

  const insufficientBalance =
    Number(balance?.balance) < Number(chain?.price) * priceMultiplier

  const { mutate: purchase, isPending: isPaying } = useMutation({
    mutationFn: (wallet: string) =>
      fetch("/api/payment", {
        method: nodeId === undefined ? "POST" : "PUT",
        body: JSON.stringify({
          wallet,
          id: nodeId ?? chain?.id,
          plan,
        }),
      }).then((response) => {
        onOpenChange?.(false)
        if (response.ok) {
          toast({
            title:
              nodeId === undefined ? "Node purchased" : "Subscription extended",
          })
          response.json().then((res) => router.push(`/nodes/${res.nodeId}`))
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
        <DialogContent
          className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
        >
          <DialogTitle className="text-white text-center font-[600] text-[28px]">
            {nodeId === undefined ? "Buy a node" : "Extend your subscription"}
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
              <div className="flex w-full gap-2 flex-column">
                {subscriptions.map(([month, priceMultiplier], key) => (
                  <div
                    key={month}
                    onClick={() => setPlan(key)}
                    className={clsx(
                      "border-[#F44336] w-1/3 border-solid border-2 p-3 cursor-pointer hover:border-red-700",
                      plan === key ? "border-green-400" : null,
                    )}
                  >
                    <p className="text-6xl">{month}</p>
                    <p>{key > 0 ? "Months" : "Month"}</p>
                    <p>{chain.price * priceMultiplier} credits</p>
                    {key > 0 && (
                      <small>
                        Saves&nbsp;
                        {chain.price * month - chain.price * priceMultiplier}
                        &nbsp;credits
                      </small>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[#F44336] mb-10">
                <strong>1x</strong> {chain.name}{" "}
                <span className="text-zinc-500">node for</span>{" "}
                <strong>{chain.price}</strong>{" "}
                <span className="text-zinc-500">credits</span>
              </p>
            </div>
          </DialogDescription>

          {insufficientBalance && (
            <p className="text-center text-yellow-600">
              Insufficient credit balance
            </p>
          )}

          <form className="flex flex-col items-center justify-center gap-8 px-8">
            {chain.hasWallet &&
              nodeId === undefined &&
              insufficientBalance == false && (
                <>
                  <label>
                    {chain.name === "Avail"
                      ? "Enter your node name"
                      : "Enter your wallet address"}
                  </label>
                  <Input
                    placeholder={
                      chain.name === "Avail"
                        ? "my-node"
                        : "0x56464... (address to receive funds)"
                    }
                    type="text"
                    value={walletAddr}
                    onChange={(e) => {
                      const value = e.target.value
                      const formattedValue =
                        chain.name === "Avail"
                          ? value.replace(/\s+/g, "-")
                          : value
                      setWalletAddr(formattedValue)
                    }}
                    className="border border-[#54597C] rounded-[12px] w-full bg-[#1D202D] placeholder:text-[#54597C]"
                  />
                </>
              )}

            <Button
              type="button"
              onClick={() => purchase(walletAddr)}
              variant="custom"
              disabled={
                isPaying ||
                insufficientBalance ||
                (chain.hasWallet && !walletAddr)

                // (chain.hasWallet && !/^0x[0-9a-fA-F]{40}$/.test(walletAddr))
              }
            >
              {isPaying && <ReloadIcon className="mr-2 animate-spin" />}
              {nodeId === undefined ? "Purchase" : "Extend Subscription"}
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
