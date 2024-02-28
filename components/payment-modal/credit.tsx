"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
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
  const [step, setStep] = useState<"form" | "waiting" | "complete" | "failed">(
    "form",
  )
  const timer = useRef<NodeJS.Timeout>()
  const timeout = useRef<NodeJS.Timeout>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: process.env.NEXT_PUBLIC_MIN_BUY_CREDIT_AMOUNT,
    },
  })
  useEffect(() => {
    setStep("form")

    if (!props.open) {
      clearInterval(timer.current)
    }
  }, [props.open])

  const { mutateAsync, isPending } = useMutation({
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
      mutateAsync(data.amount).then((tx) => {
        if (!tx) {
          return
        }
        setStep("waiting")
        clearInterval(timer.current)
        timer.current = setInterval(
          () =>
            fetch(`/api/credits/status?tx=${tx}`)
              .then((res) => res.json())
              .then((res) => {
                if (res.status === "finished") {
                  clearInterval(timer.current)
                  setStep("complete")
                  onComplete()
                } else if (res.status === "failed") {
                  clearInterval(timer.current)
                  setStep("failed")
                }
              }),
          3000,
        )
        timeout.current = setTimeout(() => {
          setStep("failed")
          clearInterval(timer.current)
        }, 12 * 60000)
      })
    },
    [onComplete, mutateAsync],
  )

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
      clearTimeout(timeout.current)
    }
  }, [])

  return (
    <Dialog {...props}>
      <DialogContent
        className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
      >
        {step === "form" ? (
          <form onSubmit={handleSubmit(buyCredit)} className="space-y-3">
            <label>Credit amount</label>
            <Input
              {...register("amount", {
                required: true,
                min: process.env.NEXT_PUBLIC_MIN_BUY_CREDIT_AMOUNT,
              })}
            />
            {errors && errors.amount && (
              <label className="text-red-900 block">
                Amount should be greater than{" "}
                {process.env.NEXT_PUBLIC_MIN_BUY_CREDIT_AMOUNT}
              </label>
            )}
            <div className="text-center">
              <Button
                type="submit"
                disabled={!!errors.amount || isPending || step !== "form"}
              >
                {(isPending || step !== "form") && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
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

            {step === "waiting" ? (
              <p className="text-[16px] font-[400] text-yellow-500">
                Waiting for your payment
              </p>
            ) : step === "complete" ? (
              <p className="text-[16px] font-[400] text-green-500">
                Successfully Paid
              </p>
            ) : (
              <p className="text-[16px] font-[400] text-red-500">Failed</p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
