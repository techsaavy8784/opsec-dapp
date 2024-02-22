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

export function CardNodesAll() {
  const { isPending, data } = useQuery<[]>({
    queryKey: ["node/list"],
    queryFn: () => fetch("/api/nodes/list").then((res) => res.json()),
  })

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
            <p className="text-xs text-muted-foreground">on 5 blockchains</p>
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
