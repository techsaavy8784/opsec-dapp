"use client"

import { LayoutProps } from "@/app/layout"
import { Sidebar } from "@/components/sidebar"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="bg-[#09090B] h-screen flex flex-row w-screen text-white  ">
    <div className="col-span-2 md:flex hidden">
      <Sidebar />
    </div>

    <div className="w-full">{children}</div>
  </div>
)

export default Layout
