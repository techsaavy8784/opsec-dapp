import { Chain } from "@covalenthq/client-sdk"
import { erc20Abi, formatUnits } from "viem"
import dayjs from "dayjs"
import prisma from "@/prisma"
import covalentClient from "./covalent-client"
import { publicClient } from "@/contract/client"

const getTaxReward = async (userId: number, userAddress: string) => {
  const reward = await prisma.reward.findFirst({
    where: { userId: userId },
  })

  const taxHistory = await prisma.taxHistory.findFirst({
    orderBy: { createdAt: "desc" },
  })

  if (!taxHistory) {
    return 0
  }

  const receivedTime = dayjs(taxHistory.createdAt)
  const receivedDiff = dayjs().diff(receivedTime, "day")

  if (reward && dayjs(reward.rewardWithdrawTime).isAfter(receivedTime)) {
    return 0
  }

  const { data: historicalBalancer } =
    await covalentClient.BalanceService.getHistoricalPortfolioForWalletAddress(
      process.env.NEXT_PUBLIC_COVALENT_CHAIN as Chain,
      userAddress,
      { days: receivedDiff + 10 },
    )
  const opsecData = historicalBalancer.items.find(
    (item) =>
      item.contract_address.toLowerCase() ===
      process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS,
  )
  if (!opsecData) {
    return 0
  }
  for (let i = receivedDiff; i < opsecData.holdings.length; i++) {
    const element = opsecData.holdings[i]
    if (
      BigInt(element.open.balance || "0") <
      BigInt(opsecData.holdings[i + 1].open.balance || "0")
    ) {
      return 0
    }
  }

  const { data: latestTokenBalances } =
    await covalentClient.BalanceService.getHistoricalTokenBalancesForWalletAddress(
      process.env.NEXT_PUBLIC_COVALENT_CHAIN as Chain,
      userAddress,
    )

  const latestOpsec = latestTokenBalances.items.find(
    (item) =>
      item.contract_address.toLowerCase() ===
      process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS,
  )
  if (!latestOpsec) {
    return 0
  }

  const latestDate = dayjs(
    Math.max(
      dayjs(latestOpsec.last_transferred_at).add(10, "day").unix(),
      reward ? dayjs(reward.rewardWithdrawTime).unix() : 0,
    ),
  )

  const [ethbalance, balance, decimals] = await Promise.all([
    publicClient.getBalance({
      address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    }),
    publicClient.readContract({
      abi: erc20Abi,
      address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
      functionName: "balanceOf",
      args: [userAddress as `0x${string}`],
    }),
    publicClient.readContract({
      abi: erc20Abi,
      address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
      functionName: "decimals",
    }),
  ])
  const balanceOpsec = Number(formatUnits(balance, decimals))

  const latestTax = await prisma.taxHistory.findFirst({
    where: { createdAt: { lte: latestDate.toDate() } },
    orderBy: { createdAt: "desc" },
  })

  const taxAmount =
    Number(formatUnits(ethbalance, 18)) - (latestTax?.amount || 0)

  const taxReward =
    (taxAmount *
      balanceOpsec *
      Number(process.env.NEXT_PUBLIC_TAX_PERCENT as string)) /
    taxHistory.totalOpsec /
    100

  return Number(taxReward)
}

export default getTaxReward
