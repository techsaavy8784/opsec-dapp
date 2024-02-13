import React, { useEffect, useState } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "./header"

export const PaymentModal: React.FC<DialogProps> = (props) => {
  const [slide, setSlide] = useState(0)

  const [walletAddr, setWalletAddr] = useState("")

  useEffect(() => {
    setSlide(0)
  }, [props.open])

  const renderHeader = () => {
    switch (slide) {
      case 0:
        return (
          <Header
            title={"Enter your wallet address"}
            description={
              "This wallet will be the one where you receive rewards"
            }
          />
        )
      case 1:
        return (
          <Header
            title={"Pay service"}
            description={"Choose service you want to pay with"}
          />
        )
      case 2:
        return (
          <Header
            title={"Waiting for payment"}
            pay
            loading={false}
            description={"You need to complete your payment to receive node"}
          />
        )
    }
  }
  return (
    <Dialog {...props}>
      <DialogContent
        className={`bg-[#18181B] border-none rounded-[24px] p-8 w-[350px] md:w-[450px]`}
      >
        {renderHeader()}
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
              onClick={() => setSlide((prev) => prev + 1)}
              variant="custom"
            >
              Pay
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
