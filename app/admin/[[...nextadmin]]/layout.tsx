"use client"

import { LayoutProps } from "@/app/layout"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div>
    <Button onClick={() => signOut()} className="fixed right-3 top-3 z-9">
      Sign out
    </Button>
    <div>{children}</div>
  </div>
)

export default Layout
