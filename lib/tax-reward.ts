import { Chain } from "@covalenthq/client-sdk"
import { erc20Abi, formatUnits } from "viem"
import dayjs from "dayjs"
import prisma from "@/prisma"
import covalentClient from "./covalent-client"
import { publicClient } from "@/contract/client"

const OPSEC_DECIMALS = 18

const getTaxReward = async (userId: number, userAddress: string) => {
  const reward = await prisma.reward.findFirst({
    where: { userId },
  })

  const taxHistory = await prisma.taxHistory.findFirst({
    orderBy: { createdAt: "desc" },
  })

  if (!taxHistory) {
    return 0
  }

  const receivedTime = dayjs(taxHistory.createdAt)

  if (reward && dayjs(reward.rewardWithdrawTime).isAfter(receivedTime)) {
    return 0
  }

  const { data: balanceHistory } =
    await covalentClient.BalanceService.getHistoricalPortfolioForWalletAddress(
      process.env.NEXT_PUBLIC_COVALENT_CHAIN as Chain,
      userAddress,
    )

  const recentOpsecBalanceHistory = balanceHistory.items.find(
    (item) =>
      item.contract_address.toLowerCase() ===
      process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS,
  )

  if (!recentOpsecBalanceHistory) {
    return 0
  }

  if (recentOpsecBalanceHistory.holdings.length <= 10) {
    // less than 10 days after holding OPSEC
    return 0
  }

  let fromDayAgo = recentOpsecBalanceHistory.holdings.length - 10

  for (let i = 0; i < fromDayAgo; i++) {
    if (
      BigInt(recentOpsecBalanceHistory.holdings[i].open.balance ?? 0) <
      BigInt(recentOpsecBalanceHistory.holdings[i + 1].open.balance ?? 0)
    ) {
      // sold $OPSEC
      if (i <= 10) {
        // in last 10 days
        return 0
      }

      // calculate reward after 10 days since sell day
      fromDayAgo = i + 10
      break
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

  const fromDate = dayjs(
    Math.max(
      dayjs().add(-fromDayAgo, "day").unix(),
      reward && reward.rewardWithdrawTime
        ? dayjs(reward.rewardWithdrawTime).unix()
        : 0,
    ),
  )

  const [stakingBalance, userBalance, lastTax] = await Promise.all([
    publicClient
      .getBalance({
        address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
      })
      .then((value) => Number(formatUnits(value, OPSEC_DECIMALS))),

    publicClient
      .readContract({
        abi: erc20Abi,
        address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
        functionName: "balanceOf",
        args: [userAddress as `0x${string}`],
      })
      .then((value) => Number(formatUnits(value, OPSEC_DECIMALS))),

    prisma.taxHistory.findFirst({
      where: { createdAt: { lte: fromDate.toDate() } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const taxAmount = stakingBalance - (lastTax?.amount ?? 0)

  const percent = Number(process.env.NEXT_PUBLIC_TAX_PERCENT) / 100

  return (percent * taxAmount * userBalance) / taxHistory.totalOpsec
}

export default getTaxReward
