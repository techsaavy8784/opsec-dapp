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

interface PaymentModalProps extends DialogProps {
  open: boolean
  chain?: Blockchain
  insufficientBalance?: boolean
  onPay: (wallet: string) => void
}

export const NodePaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onPay,
  chain,
  insufficientBalance,
  ...props
}) => {
  const [walletAddr, setWalletAddr] = useState("")
  const [isPaying, setIsPaying] = useState(false)

  const handlePayment = (wallet: string) => {
    setIsPaying(true)
    onPay(wallet)
  }

  useEffect(() => {
    if (open) {
      setIsPaying(false)
    }
  }, [open])

  return (
    <Dialog {...props} open={open}>
      {chain && (
        <DialogContent
          className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
        >
          <DialogTitle className="text-white text-center font-[600] text-[28px]">
            Buy a node{" "}
          </DialogTitle>
          <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
            <div className="flex flex-col items-center">
              <Image
                src={`/icons/blockchain/${chain.name
                  .toLowerCase()
                  .replace(/ /g, "-")}.png`}
                alt=""
                width={64}
                height={64}
                className="mt-10 mb-4"
              />
              <p className="text-[#F44336] mb-10">
                <strong>1x</strong> {chain.name}{" "}
                <span className="text-zinc-500">node for</span>{" "}
                <strong>{chain.price}</strong>{" "}
                <span className="text-zinc-500">credits</span>
              </p>
            </div>
          </DialogDescription>

          {insufficientBalance && (
            <p className="text-center text-gray-600">
              Insufficient credit balance
            </p>
          )}

          <form className="flex flex-col items-center justify-center gap-8 px-8">
            {chain.hasWallet && (
              <>
                <label>Enter your wallet address</label>
                <label>
                  This wallet will be the one where you receive rewards
                </label>
                <Input
                  placeholder="Example: 0x56464...541584"
                  type="text"
                  value={walletAddr}
                  onChange={(e) => setWalletAddr(e.target.value)}
                  className="border border-[#54597C] rounded-[12px] w-full bg-[#1D202D] placeholder:text-[#54597C]"
                />
              </>
            )}

            <Button
              type="button"
              onClick={() => handlePayment(walletAddr)}
              variant="custom"
              disabled={
                isPaying ||
                insufficientBalance ||
                (chain.hasWallet && !/^0x[0-9a-fA-F]{40}$/.test(walletAddr))
              }
            >
              {isPaying ? "Processing..." : "Purchase"}
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
