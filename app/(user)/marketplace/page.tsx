"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { NodeCard } from "@/components/node-card"
import { PaymentModal } from "@/components/payment-modal"

const Nodes: React.FC = () => {
  const [paymentModal, setPaymentModal] = useState(false)

  const serverId = useRef<string>()

  const timer = useRef<NodeJS.Timeout>()

  const { isPending, data } = useQuery<[]>({
    queryKey: ["nodes/available"],
    queryFn: () => fetch("/api/nodes?type=available").then((res) => res.json()),
  })

  const { mutateAsync } = useMutation<void, void, string>({
    mutationFn: (wallet) =>
      fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({
          wallet,
          serverId: serverId.current,
          duration: 1,
        }),
      })
        .then((res) => res.json())
        .then(({ data }) => {
          const left = (window.innerWidth - 600) / 2
          const top = (window.innerHeight - 800) / 2
          const options = `width=${600},height=${800},left=${left},top=${top},resizable=yes,scrollbars=yes`
          window.open(data.hosted_url, "_blank", options)
          return data.id
        }),
  })

  const mutate = useCallback(
    (wallet: string) =>
      new Promise<void>((resolve) => {
        mutateAsync(wallet).then((tx) => {
          if (!tx) {
            return
          }
          clearInterval(timer.current)
          timer.current = setInterval(
            () =>
              fetch(`/api/payment?tx=${tx}`)
                .then((res) => res.json())
                .then((res) => {
                  if (res.status === "Completed") {
                    clearInterval(timer.current)
                    resolve()
                  }
                }),
            1000,
          )
        })
      }),
    [mutateAsync],
  )

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  if (isPending) {
    return "Loading"
  }

  if (!data) {
    return "No data"
  }

  return (
    <>
      <div className="pb-6">
        <div className="w-full flex px-[20px] md:px-[34px] py-6 rounded-[24px] justify-center flex-col bg-[url(/backgrounds/marketplace.jpg)] bg-center bg-cover bg-no-repeat h-[172px]">
          <h1 className="uppercase text-[32px] font-[900]">{data.length}</h1>
          <h1 className="uppercase text-md font-[300]">nodes available</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 pt-2">
        {data.map((node: any) => (
          <NodeCard
            key={node.blockchain.id}
            name={node.blockchain.name}
            description={node.blockchain.description}
            onRunNodeClick={() => {
              serverId.current = node.id
              setPaymentModal(true)
            }}
          />
        ))}
        <PaymentModal
          open={paymentModal}
          onOpenChange={(open) => {
            setPaymentModal(open)
            if (!open) {
              clearInterval(timer.current)
            }
          }}
          onPay={mutate}
        />
      </div>
    </>
  )
}

export default Nodes
