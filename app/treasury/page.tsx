import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

const tablehead = ["#", "Vaults", "Blockchain", "Goal", "Funding", "Action"]

const Treasury = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-white text-[22px] font-[600]">Value</h1>
      </div>
      <div className="grid grid-cols-6 gap-6 h-[430px]">
        <div className="col-span-4 rounded-[24px]"></div>
        <div className="col-span-2 flex flex-col justify-between p-8 bg-[url(/backgrounds/treasury.png)] bg-cover bg-center rounded-[24px]">
          <div>
            <h1 className="text-[22px] text-white font-[500]">Changes in</h1>
            <h1 className="text-[22px] text-white font-[500]">24 ago</h1>
          </div>
          <div>
            <h1 className="text-[40px] text-white font-[600]">
              $15,399.<span className="font-[400] text-[28px]">23</span>
            </h1>
            <div className="py-1 px-3 bg-[#10B98133] w-fit rounded-[49px]">
              <h1 className="text-[16px] text-[#10B981] font-[500]">+12.32%</h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-white text-[22px] font-[600]">All Treasuries</h1>
      </div>
      <div className="border border-[#FFFFFF33] rounded-[16px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#FFFFFF4D]">
              {tablehead?.map((item, index) => (
                <TableHead key={index}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b-none">
              <TableCell className="text-[16px] font-[600] text-white">
                1
              </TableCell>
              <TableCell className="text-[16px] font-[600] text-white max-md:min-w-[130px]">
                Dymension
              </TableCell>
              <TableCell className="text-[14px] font-[500] text-white">
                <div className="flex items-center gap-2 ">
                  <Image
                    src="/icons/token.svg"
                    alt="money-sent"
                    width={18}
                    height={18}
                    className="translate-y-[-1px]"
                  />
                  Dymension
                </div>
              </TableCell>
              <TableCell className="text-[14px] font-[500] text-white max-md:min-w-[110px]">
                20%
              </TableCell>
              <TableCell className="text-[14px] font-[500] text-white">
                48,300 DYM
              </TableCell>
              <TableCell className="text-[16px] font-[500] text-[#F44336]">
                <div className="flex items-center gap-1 md:gap-2 ">
                  <Image
                    src="/icons/wallet.svg"
                    alt="money-sent"
                    width={18}
                    height={18}
                  />
                  Fund
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Treasury
