import type { Metadata } from "next"
import { gilroy } from "@/fonts/gilroy"
import { Providers } from "./providers"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
// import { SidebarMobile } from "@/components/sidebar/sidebar-mobile"
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
          <main className="">
            <div className="flex h-screen">
              <Sidebar />
              <div className="p-4 flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <div>{children}</div>
              </div>
            </div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
