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
    title: "Buy a node",
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
              <div className="flex flex-col items-center">
                <Image
                  src={`/icons/blockchain/${chain?.name
                    .toLowerCase()
                    .replace(/ /g, "-")}.png`}
                  alt=""
                  width={64}
                  height={64}
                  className="mt-10 mb-4"
                />
                <p className="text-[#F44336] mb-10">
                  <strong>1x</strong> {chain?.name}{" "}
                  <span className="text-zinc-500">node for</span>{" "}
                  <strong>{chain?.price}</strong>{" "}
                  <span className="text-zinc-500">USD</span>
                </p>
              </div>
            ) : (
              headerProps[slide].description
            )
          }
          payment={slide < 2 ? undefined : payment}
        />
        <form className="flex flex-col items-center justify-center gap-8 px-8">
          {slide === 0 && (
            <Input
              placeholder="Example: 0x56464...541584"
              type="text"
              value={walletAddr}
              onChange={(e) => setWalletAddr(e.target.value)}
              className="border border-[#54597C] rounded-[12px] w-full bg-[#1D202D] placeholder:text-[#54597C]"
            />
          )}
          {/* {slide === 1 && (
            <div className="py-3 px-5 bg-[#F443361A] border border-[#F44336] rounded-[12px]">
              <h1 className="text-white text-[20px] font-[500]">coinbase</h1>
            </div>
          )} */}
          {slide < 2 && (
            <Button
              type="button"
              onClick={handlePayClick}
              variant="custom"
              disabled={
                chain?.hasWallet && !/^0x[0-9a-fA-F]{40}$/.test(walletAddr)
              }
            >
              <Image
                src={`/icons/coinbase.svg`}
                alt="coinbase"
                width={24}
                height={24}
                className="mr-2"
              />
              Pay via coinbase
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
