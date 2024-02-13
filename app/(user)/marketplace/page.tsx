"use client"

import React, { useCallback, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { NodeCard } from "@/components/node-card"
import { PaymentModal } from "@/components/payment-modal"

const Nodes: React.FC = () => {
  const [paymentModal, setPaymentModal] = useState(false)

  const serverId = useRef<string>()

  const { isPending, data } = useQuery<[]>({
    queryKey: ["server/list"],
    queryFn: () => fetch("/api/server/list").then((res) => res.json()),
  })

  const { mutate } = useMutation<void, void, string>({
    mutationFn: (data) =>
      fetch("/api/purchase", {
        body: JSON.stringify({
          wallet: data,
          serverId: serverId.current,
          duration: 1,
        }),
      }),
  })

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
        {data.map((server: any) => (
          <NodeCard
            key={server.id}
            name={server.name}
            description={server.description}
            onRunNodeClick={() => {
              serverId.current = server.id
              setPaymentModal(true)
            }}
          />
        ))}
        <PaymentModal
          open={paymentModal}
          onOpenChange={setPaymentModal}
          onPay={(wallet) => mutate(wallet)}
        />
      </div>
    </>
  )
}

export default Nodes
