"use client"

import { LayoutProps } from "@/app/layout"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div>
    Log in to admin dashboard
    <div>{children}</div>
  </div>
)

export default Layout
