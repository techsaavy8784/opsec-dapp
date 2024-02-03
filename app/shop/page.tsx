import { CardWrapper } from "@/components/card-wrapper"
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
    <CardWrapper>
      <div className="grid grid-cols-4 items-center gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => <NodeCard key={item} shop />)}
      </div>
      <Pagination className="py-8">
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
    </CardWrapper>
  )
}

export default Shop
