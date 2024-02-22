import { DashCards } from "@/components/dash-card"
import { CardNodesUser } from "@/components/dashboard/user-nodes"
import { CardBlockchains } from "@/components/dashboard/blockchains"
import { CardNodesAll } from "@/components/dashboard/all-nodes"
// import { NodeCard } from "@/components/node-card"
// import { Button } from "@/components/ui/button"
// import { FiPlus } from "react-icons/fi"
import React from "react"

const Dashboard = () => {
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
          <div className="col-span-2">
            <CardNodesUser />
          </div>
          <div className="col-span-3">
            <CardNodesAll />
          </div>
          <div className="col-span-1">{/* <CardNodes /> */}</div>
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
          <div className="relative grid h-full grid-cols-2 col-span-2">
            <DashCards
              title="Coming Soon"
              value={74}
              image={"/icons/dash/tick-circle.svg"}
            />
            <DashCards
              title="Coming Soon"
              value={465}
              image={"/icons/dash/tick-circle.svg"}
            />
            <div className="z-[10] absolute top-0 left-0 w-full flex justify-center items-center h-full backdrop-blur-md">
              <h1 className="text-center text-[16px] font-[500] tracking-[10px]">
                Coming Soon
              </h1>
            </div>
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
