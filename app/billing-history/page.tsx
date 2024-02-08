import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import React from "react"

const BillingHistory = () => {
  const tablehead = [
    "#",
    "Transaction ID",
    "Amount",
    "Service",
    "Currency",
    "Status",
    "Date",
  ]
  return (
    <div className="p-6">
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
                OS-5627415
              </TableCell>
              <TableCell className="text-[14px] font-[500] text-[#F44336] max-md:min-w-[80px]">
                <div className="flex items-center gap-1 md:gap-2 ">
                  <Image
                    src="/icons/money-send.svg"
                    alt="money-sent"
                    width={18}
                    height={18}
                  />
                  -$120
                </div>
              </TableCell>
              <TableCell className="text-[14px] font-[500] text-white max-md:min-w-[110px]">
                <div className="flex items-center gap-1 md:gap-2 ">
                  <Image
                    src="/icons/tag.svg"
                    alt="money-sent"
                    width={18}
                    height={18}
                  />
                  X Node
                </div>
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
                  BTC
                </div>
              </TableCell>
              <TableCell className="text-[16px] font-[500] text-[#2EE48D]">
                Success
              </TableCell>
              <TableCell className="text-[14px] font-[500] text-white max-md:min-w-[160px]">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/calendar.svg"
                    alt="money-sent"
                    width={18}
                    height={18}
                    className="translate-y-[-2px]"
                  />
                  Jan 07, 2024
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default BillingHistory
