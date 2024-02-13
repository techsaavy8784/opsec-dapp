import React, { useCallback, useEffect, useState } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "./header"
import { Blockchain } from "@prisma/client"
import Image from "next/image"

const headerProps = [
  {
    title: "Enter your wallet address",
    description: "This wallet will be the one where you receive rewards",
  },
  {
    title: "Pay service",
    description: "Choose service you want to pay with",
  },
  {
    title: "Waiting for payment",
    description: "You need to complete your payment to receive node",
  },
]

interface PaymentModalProps extends DialogProps {
  chain?: Blockchain
  onPay: (wallet: string) => Promise<void>
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onPay,
  chain,
  ...props
}) => {
  const [slide, setSlide] = useState(chain?.hasWallet ? 0 : 1)

  const [payment, setPayment] = useState<"waiting" | "complete">("waiting")

  const [walletAddr, setWalletAddr] = useState("")

  useEffect(() => {
    setSlide(chain?.hasWallet ? 0 : 1)
  }, [props.open, chain?.hasWallet])

  const handlePayClick = useCallback(() => {
    if (slide === 1) {
      onPay(walletAddr).then(() => setPayment("complete"))
    }
    setSlide((prev) => prev + 1)
  }, [onPay, slide, walletAddr])

  return (
    <Dialog {...props}>
      <DialogContent
        className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
      >
        <Header
          title={headerProps[slide].title}
          description={
            slide === 1 ? (
              <div>
                <Image
                  src={`/icons/blockchain/${chain?.name
                    .toLowerCase()
                    .replace(/ /g, "-")}.png`}
                  alt=""
                  width={180}
                  height={180}
                  className="object-contain ml-1 mt-2"
                />
                <p>Blockchain: {chain?.name}</p>
                <p>Price: {chain?.price}</p>
              </div>
            ) : (
              headerProps[slide].description
            )
          }
          payment={slide < 2 ? undefined : payment}
        />
        <form className="flex items-center justify-center flex-col px-8 gap-8">
          {slide === 0 && (
            <Input
              placeholder="Example: 0x56464...541584"
              type="text"
              value={walletAddr}
              onChange={(e) => setWalletAddr(e.target.value)}
              className="border border-[#54597C] rounded-[12px] w-full bg-[#1D202D] placeholder:text-[#54597C]"
            />
          )}
          {slide === 1 && (
            <div className="py-3 px-5 bg-[#F443361A] border border-[#F44336] rounded-[12px]">
              <h1 className="text-white text-[20px] font-[500]">coinbase</h1>
            </div>
          )}
          {slide < 2 && (
            <Button
              type="button"
              onClick={handlePayClick}
              variant="custom"
              disabled={
                chain?.hasWallet && !/^0x[0-9a-fA-F]{40}$/.test(walletAddr)
              }
            >
              Pay
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
