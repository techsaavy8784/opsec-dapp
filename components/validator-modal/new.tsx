"use client"

import React, { useEffect, useState } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { ValidatorType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NewValidatorPurchaseModalProps extends DialogProps {
  open: boolean
}

export const NewValidatorPurchaseModal: React.FC<
  NewValidatorPurchaseModalProps
> = ({ open, onOpenChange, ...props }) => {
  const [typeId, setTypeId] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [creditPrice, setCreditPrice] = useState<number>(0)
  const [unit, setUnit] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [errorStatus, setErrorStatus] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const { data: validatorTypes, isLoading } = useQuery({
    queryKey: ["validator-node-types"],
    queryFn: () => fetch("/api/validatortype").then((res) => res.json()),
  })

  const { data: balance, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["get-user-balance"],
    queryFn: () => fetch("/api/credits/balance").then((res) => res.json()),
  })

  const init = () => {
    setTypeId("")
    setPrice("")
    setUnit("")
    setAmount("")
    setCreditPrice(0)
    setErrorStatus(false)
    setErrorMessage("")
  }

  useEffect(() => {
    if (open === false) init()
  }, [open])

  const onSelectValueChage = async (value: string) => {
    if (value !== "") {
      setPrice(
        validatorTypes
          .filter((item: ValidatorType) => item.id === Number(value))[0]
          ?.price.toString(),
      )
      setUnit(
        validatorTypes.filter(
          (item: ValidatorType) => item.id === Number(value),
        )[0]?.priceUnit,
      )
      setCreditPrice(
        Math.ceil(
          await getUSDAmountForETH(
            validatorTypes.filter(
              (item: ValidatorType) => item.id === Number(value),
            )[0]?.price,
          ),
        ),
      )
    }
    setTypeId(value)
  }

  const onPurchase = () => {
    checkError()
  }

  const checkError = async () => {
    if (typeId !== "" && amount !== "") {
      if (creditPrice < Number(amount)) {
        setErrorStatus(true)
        setErrorMessage("Exceed the amount")
      }
    } else {
      setErrorStatus(true)
      setErrorMessage("Please Select the validator type & Input the amount")
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
              {`Your Balance is ${balance.balance ?? 0} credit`}
            </div>
          </DialogDescription>
          <Select onValueChange={(value) => onSelectValueChage(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Validator Node" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Validator Nodes</SelectLabel>
                {validatorTypes.map((item: ValidatorType) => (
                  <SelectItem
                    key={item.id}
                    value={item.id.toString()}
                    onClick={() => alert(item.id)}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label htmlFor="amount">
            Price: {creditPrice}
            {` credit`} {"("}
            {price}
            {` ${unit}`}
            {")"}
          </Label>
          <Input
            value={amount}
            id="amount"
            placeholder="Amount"
            disabled={typeId === ""}
            max={Number(price)}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errorStatus && (
            <Alert variant="destructive">
              {/* <AlertCircle className="h-4 w-4" /> */}
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Button onClick={() => onPurchase}>Purchase</Button>
        </DialogContent>
      )}
    </Dialog>
  )
}
