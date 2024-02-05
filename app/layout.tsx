import type { Metadata } from "next"
import { gilroy } from "@/fonts/gilroy"
import { Providers } from "./providers"
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${gilroy.className} bg-[url(/backgrounds/dashboard.png)] bg-cover min-h-screen`}
      >
        <Providers>
          <main className="dark flex">
            <Sidebar />
            <div className="relative w-full px-3 md:pr-8 overflow-hidden h-screen">
              <Navbar />
              {children}
            </div>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  )
}
