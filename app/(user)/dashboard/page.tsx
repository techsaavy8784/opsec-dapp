"use client"

import React, { useMemo } from "react"
import { CardBlockchains } from "@/components/dashboard/blockchains"
import Nodes from "@/components/dashboard/nodes"
import { ProgressBar } from "@/components/dashboard/liquid-progress-bar"
import { TreasuryCard } from "@/components/dashboard/treasury-card"
import { useQuery } from "@tanstack/react-query"
import { NodeType } from "../nodes/page"

const Dashboard = () => {
  const { isPending, data } = useQuery<NodeType[]>({
    queryKey: ["nodes/user"],
    queryFn: () => fetch("/api/nodes/user").then((res) => res.json()),
  })

  const { isPending: isPendingCount, data: dataCount } = useQuery<{
    count: number
    chainCount: number
  }>({
    queryKey: ["nodes/count"],
    queryFn: () => fetch("/api/nodes/count").then((res) => res.json()),
  })

  const chainCount = useMemo(() => {
    const blockchains: number[] = []

    if (!Array.isArray(data)) {
      return 0
    }

    data?.forEach((node) => {
      if (!blockchains.includes(node.blockchain.id)) {
        blockchains.push(node.blockchain.id)
      }
    })

    return blockchains.length
  }, [data])

  return (
    <div className="flex flex-col">
      <div className="pb-6">
        <div className="w-full flex px-[20px] md:px-[34px] py-6 rounded-[24px] justify-end flex-col bg-[url(/backgrounds/dashboard.png)] bg-center bg-cover bg-no-repeat h-[172px]">
          <h1 className="uppercase text-[28px] font-[300]">Welcome</h1>
          <h1 className="uppercase text-[28px] font-[300]">
            To <span className="font-[900]">OPSEC CLOUDVERSE</span>
          </h1>
        </div>
      </div>
      <div className="py-6 pt-0">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
          <div className="col-span-3 md:col-span-2">
            <Nodes
              title="Your Nodes"
              count={isPending ? undefined : data?.length}
              chainCount={isPending ? undefined : chainCount}
              link="/nodes"
              className="h-full"
            />
          </div>
          <div className="col-span-3">
            <Nodes
              title="All Nodes"
              count={isPendingCount ? undefined : dataCount?.count}
              chainCount={isPendingCount ? undefined : dataCount?.chainCount}
              className="h-full"
            />
          </div>
          <div className="col-span-3 row-span-2 md:col-span-1">
            <div className="flex items-center justify-center h-full">
              <ProgressBar />
            </div>
          </div>
          <div className="col-span-3">
            <CardBlockchains />
          </div>
          {/* <DashCards
            title="My running nodes"
            value={4}
            linear
            image={"/icons/dash/node.svg"}
          /> */}
          {/* <DashCards
            title="All blockchains"
            blockchains
            image={"/icons/dash/radar.svg"}
          /> */}
          {/* <DashCards
            title="Available nodes"
            value={74}
            image={"/icons/dash/tick-circle.svg"}
          />
          <DashCards
            title="All running nodes"
            value={465}
            image={"/icons/dash/sound.svg"}
          /> */}
          <div className="col-span-3 md:col-span-2">
            <TreasuryCard className="h-full" value={3454772} />
          </div>
        </div>
      </div>
      {/* <div className="px-10 py-5">
        <h1 className="text-white font-[500] text-[16px]">Nodes</h1>
      </div>
      <div className="px-6 border-t">
        <div className="flex items-center justify-between">
          <div className="py-6 border-t-[4px] border-[#F44336] w-fit">
            <h1 className="text-[22px] font-[600]">My Nodes</h1>
          </div>
          <Button
            variant="custom"
            type="button"
            className="w-[190px] flex gap-2"
          >
            <FiPlus className="ml-2 font-[300]" />
            Get a node
          </Button>
        </div>
        <div className="pb-6">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-4">
            {[1, 2, 3, 4]?.map((item) => (
              <NodeCard key={item} path={`/dashboard/${item}`} />
            ))}
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Dashboard
