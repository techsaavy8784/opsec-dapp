"use client"

import { LayoutProps } from "@/app/layout"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div>
    <div>{children}</div>
  </div>
)

export default Layout
