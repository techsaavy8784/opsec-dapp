"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

export function CardBlockchains() {
  const { isPending, data } = useQuery<[]>({
    queryKey: ["blockchain/list"],
    queryFn: () => fetch("/api/blockchains/list").then((res) => res.json()),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchains</CardTitle>
        <CardDescription>Available chains for deployment</CardDescription>
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
            <div className="flex flex-row w-full">
              {Array.isArray(data) &&
                data?.map((blockchain: any, index) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={blockchain?.url}
                    key={index}
                    className={`${index !== 0 ? "ml-[-8px]" : ""} `}
                  >
                    <Image
                      src={`/icons/blockchain/${blockchain?.name
                        .toLowerCase()
                        .replace(/ /g, "-")}.png`}
                      alt={blockchain?.name}
                      width={32}
                      height={32}
                      className={`rounded-[5px]`}
                    />
                  </a>
                ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              on {data?.length} blockchains
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
