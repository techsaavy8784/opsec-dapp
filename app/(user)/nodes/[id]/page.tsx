"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { NodeType } from "../page"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface NodeProps {
  params: {
    id: string
  }
}

const Node: React.FC<NodeProps> = ({ params: { id } }) => {
  const { isPending, data } = useQuery<NodeType>({
    queryKey: [`nodes/${id}`],
    queryFn: () => fetch(`/api/nodes/${id}`).then((res) => res.json()),
  })

  if (isPending || !data) {
    return (
      <Skeleton className="rounded-lg w-[220] h-[320px] mr-2 block"></Skeleton>
    )
  }

  return (
    <div>
      <div className="flex bg-[url(/image/node.png)] rounded-[16px] bg-center bg-cover bg-no-repeat h-[172px] justify-center items-center ">
        <Image
          src={`/icons/blockchain/${data.server.blockchain.name
            .toLowerCase()
            .replace(/ /g, "-")}.png`}
          alt=""
          width={180}
          height={180}
          className="object-contain m-auto"
        />
      </div>
      <div>{data.server.blockchain.name}</div>
      <div>{data.server.blockchain.description}</div>
      <div>{formatDate(data.createdAt)}</div>
    </div>
  )
}

export default Node
