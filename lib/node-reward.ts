import prisma from "@/prisma"
import { PAY_TYPE, Payment } from "@prisma/client"
import dayjs from "dayjs"
import { Blockchain, Node } from "@prisma/client"

export const getNodeTotalReward = async (userId: number) => {
  const nodes = await prisma.node.findMany({
    where: {
      NOT: { server: null },
    },
    include: { payments: true, blockchain: true },
  })

  const withdrawTime = await prisma.reward
    .findFirst({
      where: { userId },
    })
    .then((res) =>
      res?.nodeRewardWithdrawTime
        ? dayjs(res.nodeRewardWithdrawTime)
        : undefined,
    )

  const totalReward = nodes.reduce((total, node) => {
    if (!node.blockchain.rewardWallet) {
      return total
    }

    const paidCredit =
      node.blockchain.payType === PAY_TYPE.FULL
        ? node.blockchain.price
        : node.payments.find((payment) => payment.userId === userId)?.credit ??
          0

    const { reward } = getNodeReward(paidCredit, node, withdrawTime)

    return total + reward
  }, 0)

  return totalReward
}

const getNodeReward = (
  paidCredit: number,
  node: Node & { blockchain: Blockchain; payments: Payment[] },
  withdrawTime?: dayjs.Dayjs,
) => {
  let now = dayjs()

  const purchaseTime = dayjs(node.createdAt)

  const lockTime = purchaseTime.add(node.blockchain.rewardLockTime ?? 0, "day")

  const ownership = paidCredit / node.blockchain.price

  if (now.isBefore(lockTime)) {
    return { reward: 0, ownership }
  }

  if (node.blockchain.payType === PAY_TYPE.FULL) {
    const expiration = node.payments.reduce(
      (total, item) => (total += item.duration),
      0,
    )
    const expirationTime = dayjs(node.createdAt).add(expiration, "day")

    if (withdrawTime?.isAfter(expirationTime)) {
      return { reward: 0, ownership }
    }

    // if node is expired, no rewards are accrued.
    if (now.isAfter(expirationTime)) {
      now = expirationTime
    }
  }

  let rewardPeriod = now.diff(purchaseTime, "month")

  if (withdrawTime) {
    rewardPeriod -= withdrawTime.diff(purchaseTime, "month")
  }

  return {
    reward: (node.blockchain.rewardPerMonth ?? 0) * rewardPeriod * ownership,
    ownership,
  }
}

export default getNodeReward
