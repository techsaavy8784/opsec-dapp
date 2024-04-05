import { createPublicClient, http } from "viem"
import { mainnet, sepolia } from "viem/chains"

export const publicClient = createPublicClient({
  chain: process.env.NODE_ENV === "production" ? mainnet : sepolia,
  transport: http(process.env.RPC_URL),
})
