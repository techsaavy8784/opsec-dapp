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

interface PurchaseModalProps extends DialogProps {
  open: boolean
  onOpenChange: () => void
  validatorID: number
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onOpenChange,
  validatorID,
  ...props
}) => {
  const [creditPrice, setCreditPrice] = useState(0)
  const [creditFloorPrice, setCreditFloorPrice] = useState(0)
  const [amount, setAmount] = useState("")
  const [errorStatus, setErrorStatus] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

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
    setAmount("")
    setCreditPrice(0)
    setErrorStatus(false)
    setErrorMessage("")
  }

  useEffect(() => {
    refetch()
    balanceRefetch()
  }, [validatorID])

  useEffect(() => {
    if (open === false) init()
    if (!isFetching)
      getUSDAmountForETH().then((value) => {
        setCreditPrice(Math.ceil(value * validator.restAmount))
        setCreditFloorPrice(
          Math.ceil(value * validator.validatorType.floorPrice),
        )
      })
  }, [isFetching, open])

  const onPurchase = async () => {
    if (await checkError()) return
    fetch("/api/validator/add/purchase", {
      method: "POST",
      body: JSON.stringify({
        validatorId: Number(validatorID),
        amount: Number(amount),
      }),
    })
      .then((res) => {
        onOpenChange()
      })
      .catch((err) => alert(err))
  }

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    setErrorStatus(false)
    setErrorMessage("")
  }

  const checkError = async () => {
    if (amount !== "") {
      if (!(amount.match(/^\d+$/) !== null)) {
        setErrorStatus(true)
        setErrorMessage("Must input the number for amount!")
        return true
      }
      if (
        creditPrice < Number(amount) ||
        balance.balance < Number(amount) ||
        creditFloorPrice > Number(amount)
      ) {
        setErrorStatus(true)
        setErrorMessage("Input the amount again")
        return true
      } else if (Number(amount) === 0) {
        setErrorStatus(true)
        setErrorMessage("Input the amount")
        return true
      } else {
        setErrorStatus(false)
        setErrorMessage("")
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

          <Label htmlFor="amount">
            Price: {creditPrice} credit ({validator.restAmount}{" "}
            {validator.validatorType.priceUnit})
          </Label>
          <Input
            value={amount}
            id="amount"
            placeholder="Amount"
            onChange={onChangeAmount}
          />
          {errorStatus && (
            <Alert variant="destructive">
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
