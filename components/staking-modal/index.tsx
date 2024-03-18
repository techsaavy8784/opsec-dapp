import React from "react"
import { Blockchain } from "@prisma/client"
import { Dialog, DialogTitle, DialogContent } from "../ui/dialog"
import { DialogProps } from "@radix-ui/react-dialog"
import Image from "next/image"
import Staking from "./staking"

interface StakingModalProps extends DialogProps {
  chain?: Blockchain
  nodeId: number
  onStakingComplete: () => void
}

export const StakingModal: React.FC<StakingModalProps> = ({
  chain,
  nodeId,
  onOpenChange,
  onStakingComplete,
  ...props
}) => (
  <Dialog {...props} onOpenChange={onOpenChange}>
    {chain && (
      <DialogContent
        className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
      >
        <DialogTitle className="text-white text-center font-[600] text-[28px]">
          Extend your subscription by
          <br />
          staking
        </DialogTitle>
        <div className="text-[#54597C] w-full text-center font-[500] text-[16px] space-y-4">
          <Image
            src={`/icons/blockchain/${chain.name
              .toLowerCase()
              .replace(/ /g, "-")}.png`}
            alt=""
            width={64}
            height={64}
            className="m-auto"
          />
          <p>How long do you want to extend the subscription by?</p>
          <Staking
            rewards={{ [chain.id]: 1 }}
            nodeId={nodeId}
            onStakingComplete={onStakingComplete}
          />
        </div>
      </DialogContent>
    )}
  </Dialog>
)
