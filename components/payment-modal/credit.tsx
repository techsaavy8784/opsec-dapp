"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { ReloadIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons"
import { DialogProps } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import { useToast } from "../ui/use-toast"
import usePollStatus from "@/hooks/usePollStatus"

interface CreditPaymentModalProps extends DialogProps {
  onComplete: () => void
}

export const CreditPaymentModal: React.FC<CreditPaymentModalProps> = ({
  onComplete,
  ...props
}) => {
  const [step, setStep] = useState<
    "form" | "initiating" | "waiting" | "complete" | "failed"
  >("form")
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

  const { toast } = useToast()

  const [transactionUrl, setTransactionUrl] = useState("")

  const { startPoll, stopPoll } = usePollStatus({
    cb: (tx: string) =>
      fetch(`/api/credits/status?tx=${tx}`)
        .then((res) => res.json())
        .then((res) => res.status),
    stopWhen: (status: string) => ["confirmed", "failed"].includes(status),
    onStop: (status: string) => {
      if (status === "confirmed") {
        setStep("complete")
        onComplete()
      } else if (status === "failed") {
        setStep("failed")
      }
    },
  })

  useEffect(() => {
    setStep("form")

    if (!props.open) {
      stopPoll()
      setTransactionUrl("")
    }
  }, [props.open, stopPoll])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (amount: number) =>
      fetch("/api/credits", {
        method: "POST",
        body: JSON.stringify({
          amount,
        }),
      })
        .then((res) => Promise.all([res.status, res.json()]))
        .then(([status, { message, code, url, tx }]) => {
          if (status === 200) {
            // const left = (window.innerWidth - 600) / 2
            // const top = (window.innerHeight - 800) / 2
            // const options = `width=${600},height=${800},left=${left},top=${top},resizable=yes,scrollbars=yes`
            // window.open(url, "_blank", options)

            setTransactionUrl(url)
            setStep("initiating")

            return tx
          }

          toast({
            title:
              code === "AMOUNT_MINIMAL_ERROR"
                ? "Amount too low, please enter a higher value"
                : message,
          })
        }),
  })

  const buyCredit = useCallback(
    (data: any) => {
      mutateAsync(data.amount).then((tx) => {
        if (!tx) {
          return
        }

        startPoll(tx)

        timeout.current = setTimeout(() => {
          setStep("failed")
          stopPoll()
        }, 12 * 60000)
      })
    },
    [mutateAsync, startPoll, stopPoll],
  )

  useEffect(() => {
    return () => clearTimeout(timeout.current)
  }, [])

  return (
    <Dialog {...props}>
      <DialogContent
        className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
      >
        {step === "form" ? (
          <form onSubmit={handleSubmit(buyCredit)} className="space-y-3">
            <label>Credit amount (USD)</label>
            <Input
              {...register("amount", {
                required: true,
                min: process.env.NEXT_PUBLIC_MIN_BUY_CREDIT_AMOUNT,
              })}
            />
            {errors && errors.amount && (
              <label className="block text-red-900">
                Amount should be greater than{" "}
                {process.env.NEXT_PUBLIC_MIN_BUY_CREDIT_AMOUNT}
              </label>
            )}
            <p className="text-xs text-zinc-400">
              1 Credit = 1 USD (all credits are non-refundable)
            </p>
            <div className="text-center">
              <Button
                type="submit"
                disabled={!!errors.amount || isPending || step !== "form"}
              >
                {(isPending || step !== "form") && (
                  <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                )}
                Continue to payment
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-center w-full">
              <Image
                src={
                  step === "complete"
                    ? "/icons/payment-pending.png"
                    : "/icons/payment-success.png"
                }
                alt="payment status"
                width={138}
                height={138}
              />
            </div>

            {step === "initiating" ? (
              <>
                <DialogTitle className="text-white text-center font-[600] text-[28px] flex items-center justify-center">
                  Waiting for payment
                </DialogTitle>
                <Button type="submit" asChild>
                  <a
                    href={transactionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                    onClick={(e) => {
                      e.preventDefault()
                      setStep("waiting")
                      window.open(
                        transactionUrl,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }}
                  >
                    Pay via{" "}
                    <Image
                      src="https://nowpayments.io/images/logo/logo.svg"
                      alt="pay via nowpayments"
                      width={120}
                      height={30}
                      className="mt-1 ml-2"
                    />
                  </a>
                </Button>
              </>
            ) : step === "waiting" ? (
              <DialogTitle className="text-white text-center font-[600] text-[28px] flex items-center justify-center">
                <ReloadIcon className="w-6 h-6 mr-3 animate-spin" />
                Waiting for payment
              </DialogTitle>
            ) : step === "complete" ? (
              <DialogTitle className="text-green-500 text-center font-[600] text-[28px] flex items-center justify-center">
                <CheckIcon className="h-9 w-9" />
                Successfully paid
              </DialogTitle>
            ) : (
              step === "failed" && (
                <DialogTitle className="text-red-500 text-center font-[600] text-[28px] flex items-center justify-center">
                  <Cross2Icon className="w-6 h-6 mr-4" />
                  Payment failed
                </DialogTitle>
              )
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
