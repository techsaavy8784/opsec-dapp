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

interface NodesProps {
  title: string
  count?: number
  chainCount?: number
}

const Nodes: React.FC<NodesProps> = ({ title, count, chainCount }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>Currently running nodes</CardDescription>
    </CardHeader>
    <CardContent>
      {count === undefined ? (
        <div className="flex flex-row w-full">
          <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
          <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
          <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
          <Skeleton className="rounded-lg w-[32px] h-[32px]"></Skeleton>
        </div>
      ) : (
        <>
          <div className="text-4xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">
            on {chainCount} blockchains
          </p>
        </>
      )}
      <Button className="mt-6 w-full items-center">
        <FiCloud className="mr-2" />
        View
      </Button>
    </CardContent>
  </Card>
)

export default Nodes
