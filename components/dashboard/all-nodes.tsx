"use client"

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
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export function CardNodesAll() {
  const { isPending, data } = useQuery<[]>({
    queryKey: ["node/list/all"],
    queryFn: () => fetch("/api/nodes/list/all").then((res) => res.json()),
  })

  const blockchainCnt = useMemo(() => {
    const blockchains: any[] = []
    data?.forEach((node: any) => {
      if (!blockchains.find(node.server.blockchain.id)) {
        blockchains.push(node.server.blockchain.id)
      }
    })
    return blockchains.length
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Nodes</CardTitle>
        <CardDescription>Currently running nodes</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-row w-full">
            <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
            <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
            <Skeleton className="rounded-lg w-[32px] h-[32px] mr-2"></Skeleton>
            <Skeleton className="rounded-lg w-[32px] h-[32px]"></Skeleton>
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold">{data?.length}</div>
            <p className="text-xs text-muted-foreground">
              on {blockchainCnt} blockchains
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
}