"use client"

import React from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import getPriceETH from "@/lib/getPriceETH"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm, SubmitHandler } from "react-hook-form"

interface PurchaseModalProps extends DialogProps {
  open: boolean
  onPurchase: () => void
  validatorId: number
}

type FormValues = {
  amount: number
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onPurchase,
  validatorId,
  onOpenChange,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const { data: validator, isFetching } = useQuery({
    queryKey: ["validator", validatorId],
    queryFn: () =>
      fetch(`/api/validator/${validatorId}`).then((res) => res.json()),
  })

  const { data: balance } = useQuery({
    queryKey: ["credits/balance"],
    queryFn: () => fetch("/api/credits/balance").then((res) => res.json()),
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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    fetch("/api/validator/add/purchase", {
      method: "POST",
      body: JSON.stringify({
        validatorId: Number(validatorId),
        amount: Number(data.amount),
      }),
    })
      .then(() => onPurchase())
      .catch((err) => alert(err))
  }

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      {!isFetching && (
        <DialogContent className="bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]">
          <DialogTitle className="text-white text-center font-[600] text-[28px]">
            Purchase a Validator Node
          </DialogTitle>
          <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
            <div className="flex flex-col items-center gap-4">
              Your credit balance is {balance?.balance ?? 0}
            </div>
          </DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="amount">
              Price: {priceInCredit} credit ({validator.restAmount}{" "}
              {validator.validatorType.priceUnit})
            </Label>
            <Input
              id="amount"
              placeholder="Amount"
              {...register("amount", {
                required: true,
                pattern: /^\d+$/,
                validate: {
                  validAmount: (value) =>
                    value > 0 &&
                    value <= priceInCredit &&
                    value <= balance.balance &&
                    value >= creditFloorPrice,
                },
              })}
            />
            {errors.amount && (
              <Alert className="mt-3" variant="destructive">
                {errors.amount.type === "required" && (
                  <>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Amount is required</AlertDescription>
                  </>
                )}
                {errors.amount.type === "pattern" && (
                  <>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Amount must be a number</AlertDescription>
                  </>
                )}
                {errors.amount.type === "validAmount" && (
                  <>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Input the amount again</AlertDescription>
                  </>
                )}
              </Alert>
            )}
            <Button className="w-full mt-3" type="submit">
              Purchase
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
