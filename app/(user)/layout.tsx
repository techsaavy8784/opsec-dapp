import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { LayoutProps } from "../layout"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <main className="container">
    <div className="flex h-screen p-2">
      <Sidebar />
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div>{children}</div>
      </div>
    </div>
  </main>
)

export default Layout
