import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"

const dummyDym = [
  {
    title: "Total Time Validating",
    value: "2 Days",
  },
  {
    title: "Uptime",
    value: "100%",
  },
  {
    title: "Earnings 64DYM",
    value: "64DYM",
  },
  {
    title: "DYM staked",
    value: "48,300",
  },
  {
    title: "Commision",
    value: "5%",
  },
  {
    title: "Stake Requirement:",
    value: "46,000",
  },
]

const Dymension = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="max-md:px-4 m-0 p-0">
        <div className="grid grid-cols-1 max-md:gap-4 md:grid-cols-6 rounded-[16px] bg-[#18181B] px-4 py-6">
          {dummyDym?.map((item, i) => (
            <div
              className={`col-span-1 max-md:items-center max-md:border-b-[2px] max-md:border-[#3F3F46] max-md:py-3 flex flex-col gap-2 md:pl-4 ${i !== 5 ? "md:border-r border-[#3F3F46]" : ""}`}
              key={i}
            >
              <h4 className="text-[14px] font-[500] text-[#71717A]">
                {item.title}
              </h4>
              <h1 className="text-[16px] font-[600] text-[#fff]">
                {item?.value}
              </h1>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-white text-[22px] font-[600] ml-6">Funding</h1>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="w-[330px] md:w-[464px] bg-[#18181B] p-6 rounded-[24px] flex flex-col gap-4">
          <h1 className="text-white text-[22px] font-[600] text-center">
            Fund DYM
          </h1>
          <p className="text-[#71717A] text-[16px] font-[500] text-center">
            [Description]
          </p>
          <form className="flex flex-col gap-2">
            <Label
              htmlFor="amount"
              className="text-[#A1A1AA] font-[500] text-[14px] px-2"
            >
              DYM amount
            </Label>
            <Input
              type="text"
              placeholder="Enter here.."
              name="amount"
              id="amount"
              className="bg-transparent border border-[#27272A] p-3 px-[14px] rounded-[12px]"
            />
            <div className="flex justify-between items-center mb-1">
              <p className="text-[14px] text-white font-[500]">Your balance</p>
              <p className="text-[14px] text-[#F44336] font-[500]">
                100.006 DYM
              </p>
            </div>
            <Button type="submit" variant="custom" className="mt-2">
              Stake
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Dymension
