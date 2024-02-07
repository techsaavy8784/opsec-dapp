import type { Metadata } from "next"
import { gilroy } from "@/fonts/gilroy"
import { Providers } from "./providers"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import ProtectRoutes from "./protect-routes"
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Opsec Nodes",
  description: "Secure node management for the masses",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${gilroy.className} bg-black dark`}>
        <Providers>
          <ProtectRoutes>
            <main className="container">
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
                  <div className="overflow-y-scroll">{children}</div>
                </div>
              </div>
            </main>
          </ProtectRoutes>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
