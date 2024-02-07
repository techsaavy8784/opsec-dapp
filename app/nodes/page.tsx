import { NodeCard } from "@/components/node-card"
import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Shop = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-white text-[22px] font-[600]">Available nodes</h1>
      </div>
      <div className="max-md:px-4 m-0 p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
            <NodeCard key={item} shop />
          ))}
        </div>
        <Pagination className="py-4 md:py-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="h-[35px] w-[35px] bg-white rounded-[13px] flex items-center justify-center"
                href="#"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive href="#" className="text-white">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={false} href="#" className="text-white">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className="h-[35px] w-[35px] bg-white rounded-[13px] flex items-center justify-center"
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default Shop
