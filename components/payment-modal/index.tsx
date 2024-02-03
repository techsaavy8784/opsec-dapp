import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaArrowRightLong } from "react-icons/fa6"

export const PaymentModal = () => {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button type="button" variant="custom">
          Run a node
          <FaArrowRightLong className="ml-2 font-[300]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0E111C] border-none rounded-[24px] p-8">
        <DialogHeader>
          <DialogTitle className="text-white text-center font-[600] text-[28px]">
            Enter your wallet address
          </DialogTitle>
          <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
            This wallet will be the one where you receive rewards
          </DialogDescription>
          <div className="flex items-center justify-center mt-8 flex-col py-8 px-8 gap-8">
            <Input
              placeholder="Example: 0x56464...541584"
              type="text"
              className="border border-[#54597C] rounded-[12px] w-full bg-[#1D202D] placeholder:text-[#54597C]"
            />
            <Button type="button" variant="custom">
              Pay
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
