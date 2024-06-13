"use client"

import React from "react"
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth"
import { SessionProvider } from "next-auth/react"
import {
  getDefaultConfig,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { chain } from "@/contract/client"

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!

const config = getDefaultConfig({
  appName: "Opsec",
  projectId: projectId,
  chains: [chain],
  ssr: true,
})

const theme = darkTheme()

const queryClient = new QueryClient()

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Opsec",
})

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <WagmiProvider config={config}>
    <SessionProvider refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider theme={theme}>{children}</RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  </WagmiProvider>
)
