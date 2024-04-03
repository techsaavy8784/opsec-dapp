"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import ProtectRoutes from "../protect-routes"
import { SidebarMobile } from "@/components/sidebar/sidebar-mobile"
import { LayoutProps } from "../layout"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <main className="md:container">
    <div className="flex h-screen">
      <div className="max-md:hidden">
        <Sidebar />
      </div>
      <SidebarMobile />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6 overflow-y-scroll">
          <ProtectRoutes>{children}</ProtectRoutes>
        </div>
      </div>
    </div>
  </main>
)

export default Layout
