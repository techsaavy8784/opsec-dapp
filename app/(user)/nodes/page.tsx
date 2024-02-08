"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Node } from "@prisma/client"
import { NodeCard } from "@/components/node-card"
import { PaymentModal } from "@/components/payment-modal"

const Nodes: React.FC = () => {
  const [paymentModal, setPaymentModal] = useState(false)

  const { isPending, data } = useQuery<Node[]>({
    queryKey: ["nodes/available"],
    queryFn: () => fetch("/api/nodes?type=available").then((res) => res.json()),
  })

  if (isPending) {
    return "Loading"
  }

  if (!data) {
    return "No data"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
      {data.map((node) => (
        <NodeCard
          key={node.id}
          title={node.server.blockchain.name}
          description={node.server.blockchain.description}
          onRunNodeClick={() => setPaymentModal(true)}
        />
      ))}

      <PaymentModal open={paymentModal} onOpenChange={setPaymentModal} />
    </div>
  )
}

export default Nodes
