import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FiCloud } from "react-icons/fi"
import Link from "next/link"

interface NodesProps {
  title: string
  activeCount?: number
  totalCount?: number
  chainCount?: number
  link?: string
  className?: string
}

const Nodes: React.FC<NodesProps> = ({
  title,
  activeCount,
  totalCount,
  chainCount,
  link,
  className,
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>Currently running nodes</CardDescription>
    </CardHeader>
    <CardContent>
      {totalCount === undefined ? (
        <div className="flex flex-row w-full">
          <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
          <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
          <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
          <Skeleton className="rounded-lg w-[32px] h-[32px]"></Skeleton>
        </div>
      ) : (
        <>
          <div className="text-4xl font-bold">
            {activeCount === totalCount ? (
              totalCount
            ) : (
              <>
                {activeCount}
                <span className="text-xl mx-4">/</span>
                {totalCount}
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            on {chainCount} blockchains
          </p>
        </>
      )}
      {link && (
        <Button asChild variant="custom" className="mt-6 w-full items-center">
          <Link href={link}>
            <FiCloud className="mr-2" />
            View
          </Link>
        </Button>
      )}
    </CardContent>
  </Card>
)

export default Nodes
