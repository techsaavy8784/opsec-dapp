"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"

interface CreditPaymentModalProps extends DialogProps {
  onComplete: () => void
}

export const CreditPaymentModal: React.FC<CreditPaymentModalProps> = ({
  onComplete,
  ...props
}) => {
  const [step, setStep] = useState(0)
  const [payment, setPayment] = useState<"waiting" | "complete">("waiting")
  const timer = useRef<NodeJS.Timeout>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 50,
    },
  })
  useEffect(() => {
    setStep(0)
    setPayment("waiting")

    if (!props.open) {
      clearInterval(timer.current)
    }
  }, [props.open])

  const { mutateAsync } = useMutation({
    mutationFn: (amount: number) =>
      fetch("/api/credits", {
        method: "POST",
        body: JSON.stringify({
          amount,
        }),
      })
        .then((res) => res.json())
        .then(({ url, tx }) => {
          const left = (window.innerWidth - 600) / 2
          const top = (window.innerHeight - 800) / 2
          const options = `width=${600},height=${800},left=${left},top=${top},resizable=yes,scrollbars=yes`
          window.open(url, "_blank", options)
          return tx
        }),
  })

  const buyCredit = useCallback(
    (data: any) => {
      setStep(1)
      mutateAsync(data.amount).then((tx) => {
        if (!tx) {
          return
        }
        clearInterval(timer.current)
        timer.current = setInterval(
          () =>
            fetch(`/api/credits/status?tx=${tx}`)
              .then((res) => res.json())
              .then((res) => {
                if (res.status === "finished") {
                  clearInterval(timer.current)
                  setPayment("complete")
                  onComplete()
                }
              }),
          1000,
        )
      })
    },
    [onComplete, mutateAsync],
  )

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  return (
    <Dialog {...props}>
      <DialogContent
        className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
      >
        {step === 0 ? (
          <form onSubmit={handleSubmit(buyCredit)} className="space-y-3">
            <label>Credit amount</label>
            <Input {...register("amount", { required: true, min: 50 })} />
            {errors && errors.amount && (
              <label className="text-red-900 block">
                Amount should be greater than 50
              </label>
            )}
            <div className="text-center">
              <Button type="submit">
                Pay via{" "}
                <Image
                  src="https://nowpayments.io/images/logo/logo.svg"
                  alt="pay via nowpayments"
                  width={120}
                  height={30}
                  className="ml-2 mt-1"
                />
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-center w-full">
              <Image src="/image/pay.svg" alt="pay" width={138} height={138} />{" "}
            </div>
            <DialogTitle className="text-white text-center font-[600] text-[28px]">
              Waiting for payment
            </DialogTitle>
            <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
              You need to complete your payment to receive node
            </DialogDescription>

            <p
              className={`text-[16px] font-[400] ${
                payment === "waiting" ? "text-[#FFEB3B]" : "text-[#10B981]"
              }`}
            >
              {payment === "waiting"
                ? "Waiting for your payment"
                : "Successfully Paid"}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
