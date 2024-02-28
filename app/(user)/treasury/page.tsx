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
import { TreasuryChart } from "@/components/charts/treasury-chart"

const tablehead = ["#", "Vaults", "Blockchain", "Goal", "Funding", "Action"]

const Treasury = () => {
  return (
    <div className="py-6 flex flex-col gap-6 blur-md">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <div className="col-span-2 md:col-span-4 rounded-[24px] bg-[#18181B] p-2 h-[330px] md:h-[430px]">
          <TreasuryChart />
        </div>
        <div className="col-span-2 h-[280px] md:h-[430px] flex flex-col justify-between p-8 bg-[url(/backgrounds/treasury.png)] bg-cover bg-center rounded-[24px]">
          <div>
            <h1 className="text-[22px] text-white font-[500]">Total Value</h1>
            <h1 className="text-[22px] text-white font-[500]">Locked</h1>
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
        <h1 className="text-white text-[22px] font-[600]">Vaults</h1>
      </div>
      <div className="border border-[#FFFFFF33] rounded-[16px] max-md:w-[calc(100vw-40px)] overflow-hidden">
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
              <TableCell className="text-[14px] font-[500] text-white  max-md:min-w-[110px]">
                48,300 DYM
              </TableCell>
              <TableCell className="text-[16px] font-[500] text-[#F44336] max-md:min-w-[110px]">
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
