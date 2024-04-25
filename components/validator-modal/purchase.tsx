"use client"

import React, { useEffect, useState } from "react"
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
  onOpenChange: () => void
  validatorID: number
}

type FormValues = {
  amount: number
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onOpenChange,
  validatorID,
  ...props
}) => {
  const [creditPrice, setCreditPrice] = useState(0)
  const [creditFloorPrice, setCreditFloorPrice] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const {
    data: validator,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["validator-by-ID"],
    queryFn: () =>
      fetch(`/api/validator/${validatorID}`).then((res) => res.json()),
  })

  const {
    data: balance,
    isFetching: isBalanceFetching,
    refetch: balanceRefetch,
  } = useQuery({
    queryKey: ["get-user-balance"],
    queryFn: () => fetch("/api/credits/balance").then((res) => res.json()),
  })

  const init = () => {
    setCreditPrice(0)
  }

  useEffect(() => {
    refetch()
    balanceRefetch()
  }, [validatorID])

  useEffect(() => {
    if (open === false) init()
    if (!isFetching)
      getPriceETH().then((value) => {
        setCreditPrice(Math.ceil(value * validator.restAmount))
        setCreditFloorPrice(
          Math.ceil(value * validator.validatorType.floorPrice),
        )
      })
  }, [isFetching, open])

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    fetch("/api/validator/add/purchase", {
      method: "POST",
      body: JSON.stringify({
        validatorId: Number(validatorID),
        amount: Number(data.amount),
      }),
    })
      .then((res) => {
        onOpenChange()
      })
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
              Your Balance is {!isBalanceFetching && (balance.balance ?? 0)}{" "}
              credit
            </div>
          </DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="amount">
              Price: {creditPrice} credit ({validator.restAmount}{" "}
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
                    value <= creditPrice &&
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
