import { Chain } from "@covalenthq/client-sdk"
import { erc20Abi, formatUnits } from "viem"
import dayjs from "dayjs"
import { covalentClient } from "./covalent"
import prisma from "@/prisma"
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

  if (reward && dayjs(reward.rewardWithdrawTime).isAfter(receivedTime)) {
    return 0
  }

  const { data: historicalBalancer } =
    await covalentClient.BalanceService.getHistoricalPortfolioForWalletAddress(
      process.env.NEXT_PUBLIC_COVALENT_CHAIN as Chain,
      userAddress,
      { days: dayjs().diff(receivedTime, "day") + 10 },
    )
  const opsecData = historicalBalancer.items.find(
    (item) =>
      item.contract_address.toLowerCase() ===
      process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS,
  )
  if (!opsecData) {
    return 0
  }
  const holdings = opsecData.holdings.filter((item) =>
    receivedTime.isAfter(dayjs(item.timestamp)),
  )
  for (let i = 0; i < holdings.length; i++) {
    const element = holdings[i]
    if (
      BigInt(element.open.balance || "0") <
      BigInt(opsecData.holdings[i + 1].open.balance || "0")
    ) {
      return 0
    }
  }

  const balance = await publicClient.readContract({
    abi: erc20Abi,
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
  })
  const decimals = await publicClient.readContract({
    abi: erc20Abi,
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
    functionName: "decimals",
  })
  const balanceOpsec = Number(formatUnits(balance, decimals))

  const taxReward =
    (taxHistory.amount *
      balanceOpsec *
      Number(process.env.NEXT_PUBLIC_TAX_PERCENT as string)) /
    taxHistory.totalOpsec /
    100

  return Number(taxReward)
}

export default getTaxReward
