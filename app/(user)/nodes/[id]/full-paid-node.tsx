"use client"

import React, { useState } from "react"
import { daysPassedSince } from "@/lib/utils"
import clsx from "clsx"
import { NodePaymentModal } from "@/components/payment-modal/full-paid-node"
import { Button } from "@/components/ui/button"
import { ExtendStakingModal } from "@/components/extend-staking-modal"
import { NodeType } from "@/app/(user)/nodes/page"

type Props = {
  node: NodeType
  refetch: () => void
}

export const FullNode: React.FC<Props> = ({ node, refetch }) => {
  const [modal, setModal] = useState(false)

  const daysTillExpiration = Math.max(
    0,
    node.payments.reduce((sum, item) => (sum += item.duration), 0) -
      daysPassedSince(node.createdAt),
  )

  const soonExpired =
    daysTillExpiration < Number(process.env.NEXT_PUBLIC_NODE_EXPIRE_WARN_DAYS)

  const stakeId = node.payments.find(
    (payment) => payment.stakeId !== null,
  )?.stakeId

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-[500] text-[#52525B]">
          Days remaining
        </h1>
        <h1
          className={clsx(
            "text-[14px] font-[500]",
            soonExpired ? "text-yellow-500" : "text-white",
          )}
        >
          {daysTillExpiration}
        </h1>
      </div>

      {["Avail", "BEVM"].includes(node.blockchain.name) && (
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-[500] text-[#52525B]">Telemetry</h1>
          <div className="flex items-center gap-1">
            <a
              target="_blank"
              href={
                node.blockchain.name === "Avail"
                  ? `https://telemetry.avail.tools/#/${node.wallet}`
                  : `https://telemetry-testnet.bevm.io/#/${node.wallet}`
              }
              rel="noopener noreferrer"
              className="font-[600] text-[14px] text-zinc-500 underline"
            >
              View
            </a>
          </div>
        </div>
      )}

      <div className="text-center pt-8">
        <Button onClick={() => setModal(true)}>Extend subscription</Button>
        {stakeId ? (
          <ExtendStakingModal
            stakeId={stakeId}
            open={modal}
            onOpenChange={() => setModal(false)}
            onComplete={() => refetch()}
          />
        ) : (
          <NodePaymentModal
            nodeId={node.id}
            open={modal}
            chain={node.blockchain}
            onOpenChange={() => setModal(false)}
            onPurchaseComplete={() => refetch()}
          />
        )}
      </div>
    </>
  )
}
