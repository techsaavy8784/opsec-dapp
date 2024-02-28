import React from "react"
import type { Metadata } from "next"
import { gilroy } from "@/fonts/gilroy"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Opsec Cloudverse",
  description: "Secure blockchain management for the people",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/og.jpg`,
    siteName: "Opsec Cloudverse",
  },
  icons: [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`,
    },
  ],
}

export interface LayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => (
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
