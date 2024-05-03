"use client"

import React from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Validator, ValidatorType } from "@prisma/client"
import getPriceETH from "@/lib/getPriceETH"

export type ValidatorData = Validator & {
  validatorType: ValidatorType
  restAmount: number
  ownership: number
  mepaidAmount: number
  rewardAmount?: number
}

interface PurchaseModalProps extends DialogProps {
  onPurchase: () => void
  validator?: ValidatorData
}

type FormValues = {
  amount: number
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  onPurchase,
  validator,
  onOpenChange,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const { data: balance } = useQuery({
    queryKey: ["credits/balance"],
    queryFn: () => fetch("/api/credits/balance").then((res) => res.json()),
  })

  const { isPending, mutate } = useMutation({
    mutationFn: (amount: number) =>
      fetch("/api/validator/add/purchase", {
        method: "POST",
        body: JSON.stringify({
          validatorId: Number(validator?.id),
          amount: Number(amount),
        }),
      }),

    onSuccess: () => onPurchase(),
  })

  const { data: ethPrice } = useQuery({
    queryKey: ["ethprice"],
    queryFn: () => getPriceETH(),
  })

  const priceInCredit = Math.ceil(
    (ethPrice ?? 0) * (validator?.restAmount ?? 0),
  )

  const creditFloorPrice = Math.ceil(
    (ethPrice ?? 0) * (validator?.validatorType.floorPrice ?? 0),
  )

  return (
    <Dialog {...props} open={!!validator} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]">
        <DialogTitle className="text-white text-center font-[600] text-[28px]">
          Purchase a Validator Node
        </DialogTitle>
        <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
          <div className="flex flex-col items-center gap-4">
            Your credit balance is {balance?.balance ?? 0}
          </div>
        </DialogDescription>
        <form
          onSubmit={handleSubmit((data) => mutate(data.amount))}
          className="space-y-2"
        >
          <Label htmlFor="amount">
            Price: {priceInCredit} credit ({validator?.restAmount}{" "}
            {validator?.validatorType.priceUnit})
          </Label>
          <Input
            id="amount"
            placeholder="Amount"
            {...register("amount", {
              required: true,
              pattern: /^\d+$/,
              validate: {
                underBalance: (value) => value <= balance.balance,
                validAmount: (value) =>
                  value > 0 &&
                  value <= priceInCredit &&
                  value >= creditFloorPrice,
              },
            })}
          />
          {errors.amount && (
            <small className="block text-red-700">
              {errors.amount.type === "required" && "Amount is required"}
              {errors.amount.type === "pattern" && "Amount must be a number"}
              {errors.amount.type === "validAmount" &&
                `Amount should be between ${creditFloorPrice} and ${priceInCredit}`}
              {errors.amount.type === "underBalance" &&
                "Insufficient credit balance"}
            </small>
          )}
          <div className="text-center">
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
              )}
              Purchase
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
