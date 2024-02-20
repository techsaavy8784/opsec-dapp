import type { Metadata } from "next"
import { gilroy } from "@/fonts/gilroy"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import ProtectRoutes from "./protect-routes"
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"
import React from "react"

export const metadata: Metadata = {
  title: "Opsec Nodes",
  description: "Secure node management for the masses",
}

interface LayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => (
  // Wrap the Providers component with SessionProvider
  <html lang="en">
    <body className={`${gilroy.className} bg-black dark`}>
      <Providers>
        {children}
        <Toaster />
      </Providers>
    </body>
  </html>
)

export default RootLayout
