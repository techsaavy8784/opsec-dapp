"use client"

import { LayoutProps } from "@/app/layout"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="bg-gray-800 h-screen text-black">
    <div>{children}</div>
  </div>
)

export default Layout
