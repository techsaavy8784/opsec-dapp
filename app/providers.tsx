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
import { mainnet, sepolia } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? ""

const config = getDefaultConfig({
  appName: "Opsec",
  projectId,
  chains: [process.env.NODE_ENV === "production" ? mainnet : sepolia],
})

const theme = darkTheme()

const queryClient = new QueryClient()

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to my RainbowKit app",
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
