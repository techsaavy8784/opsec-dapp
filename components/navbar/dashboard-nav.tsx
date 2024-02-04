import React from "react"

export const DashboardNav = ({ pathName }: { pathName: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h1 className="text-white font-[700] text-[32px]">
        {pathName.split("/")[2] ? "Node" : "Your Nodes"}
      </h1>
      <h1 className="text-white font-[500] text-lg">[Description]</h1>
    </div>
  )
}
