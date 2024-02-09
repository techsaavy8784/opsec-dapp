import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { LayoutProps } from "../layout"
import { SidebarMobile } from "@/components/sidebar/sidebar-mobile"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <main className="md:container">
    <div className="flex h-screen">
      <div className="max-md:hidden">
        <Sidebar />
      </div>
      <SidebarMobile />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="overflow-y-scroll">{children}</div>
      </div>
    </div>
  </main>
)

export default Layout
