import type { Metadata } from "next"
import { gilroy } from "@/fonts/gilroy"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import ProtectRoutes from "./protect-routes"
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"
import React from "react"

export const metadata: Metadata = {
  title: "Opsec Nodes",
  description: "Secure node management for the masses",
}

export interface LayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => (
  <html lang="en">
    <body className={`${gilroy.className} bg-black dark`}>
      <Providers>
        <ProtectRoutes>{children}</ProtectRoutes>
        <Toaster />
      </Providers>
    </body>
  </html>
)

export default RootLayout
