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
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExistValidatorPurchaseModalProps extends DialogProps {
  open: boolean
  onOpenChange: () => void
  validatorID: number
}

export const ExistValidatorPurchaseModal: React.FC<
  ExistValidatorPurchaseModalProps
> = ({ open, onOpenChange, validatorID, ...props }) => {
  const [creditPrice, setCreditPrice] = useState<number>(0)
  const [amount, setAmount] = useState<string>("")
  const [errorStatus, setErrorStatus] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const { data: validator, isLoading } = useQuery({
    queryKey: ["validator-by-ID"],
    queryFn: () =>
      fetch(`/api/validator/${validatorID}`).then((res) => res.json()),
  })

  const { data: balance, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["get-user-balance"],
    queryFn: () => fetch("/api/credits/balance").then((res) => res.json()),
  })

  const init = () => {
    setAmount("")
    setCreditPrice(0)
    setErrorStatus(false)
    setErrorMessage("")
  }

  useEffect(() => {
    if (open === false) init()
    const calcCredit = async () => {
      if (!isLoading)
        setCreditPrice(
          Math.ceil(await getUSDAmountForETH(validator.validator_types.price)),
        )
    }
    calcCredit()
  }, [isLoading, open])

  const onPurchase = async () => {
    if (await checkError()) return
    fetch("/api/validator/add/exist", {
      method: "POST",
      body: JSON.stringify({
        typeId: Number(validatorID),
        amount: Number(amount),
      }),
    })
      .then((res) => {
        onOpenChange()
      })
      .catch((err) => alert(err))
  }

  const checkError = async () => {
    if (amount !== "") {
      if (creditPrice < Number(amount) || balance.balance < Number(amount)) {
        setErrorStatus(true)
        setErrorMessage("Exceed the amount")
        return true
      } else if (Number(amount) === 0) {
        setErrorStatus(true)
        setErrorMessage("Input the amount")
        return true
      } else {
        setErrorStatus(false)
        return false
      }
    } else {
      setErrorStatus(true)
      setErrorMessage("Input the amount")
      return true
    }
  }

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      {!isLoading && (
        <DialogContent
          className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
        >
          <DialogTitle className="text-white text-center font-[600] text-[28px]">
            {"Purchase a Validator Node"}
          </DialogTitle>
          <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
            <div className="flex flex-col items-center gap-4">
              {`Your Balance is ${!isBalanceLoading && (balance.balance ?? 0)} credit`}
            </div>
          </DialogDescription>

          <Label htmlFor="amount">
            Price: {creditPrice}
            {` credit`} {"("}
            {validator.validator_types.price}
            {` ${validator.validator_types.priceUnit}`}
            {")"}
          </Label>
          <Input
            value={amount}
            id="amount"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          {errorStatus && (
            <Alert variant="destructive">
              {/* <AlertCircle className="h-4 w-4" /> */}
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Button onClick={() => onPurchase()}>Purchase</Button>
        </DialogContent>
      )}
    </Dialog>
  )
}
