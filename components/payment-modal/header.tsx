import React from "react"
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"

type HeaderProps = {
  title: string
  description: React.ReactNode
  payment?: "waiting" | "complete"
}

export const Header: React.FC<HeaderProps> = ({
  title,
  description,
  payment,
}) => {
  return (
    <DialogHeader>
      {payment && (
        <div className="flex items-center justify-center w-full">
          <Image src="/image/pay.svg" alt="pay" width={138} height={138} />{" "}
        </div>
      )}
      <DialogTitle className="text-white text-center font-[600] text-[28px]">
        {title}
      </DialogTitle>
      <DialogDescription className="text-[#54597C] w-full text-center font-[500] text-[16px]">
        {description}
      </DialogDescription>
      {payment && (
        <div className="flex gap-3 w-full flex-col pt-6">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-[#fff] text-[16px] font-[500]">
              Payment status:
            </h1>
            <div className="flex items-center gap-1">
              <p className="text-[#F44336] text-[16px] font-[500]">Refersh</p>
              <Image
                src="/icons/refresh.svg"
                alt="refresh"
                width={18}
                height={18}
              />
            </div>
          </div>
          <p
            className={`text-[16px] font-[400] ${
              payment === "waiting" ? "text-[#FFEB3B]" : "text-[#10B981]"
            }`}
          >
            {payment === "waiting"
              ? "Waiting for your payment"
              : "Successfully Paid"}
          </p>
        </div>
      )}
    </DialogHeader>
  )
}
