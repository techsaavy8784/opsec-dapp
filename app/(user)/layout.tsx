"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { SessionProvider } from "next-auth/react"
import ProtectRoutes from "../protect-routes"
import { SidebarMobile } from "@/components/sidebar/sidebar-mobile"

interface LayoutProps {
  children: React.ReactNode
  session: any
}

const Layout: React.FC<LayoutProps> = ({ children, session }) => (
  <SessionProvider session={session}>
    <main className="md:container">
      <div className="flex h-screen">
        <div className="max-md:hidden">
          <Sidebar />
        </div>
        <SidebarMobile />
        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="px-6 overflow-y-scroll">
            <ProtectRoutes>{children}</ProtectRoutes>
          </div>
        </div>
      </div>
    </main>
  </SessionProvider>
)

export default Layout
