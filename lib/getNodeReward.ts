import dayjs from "dayjs"
import { Blockchain, Node } from "@prisma/client"

const getNodeReward = (
  paidCredit: number,
  node: Node & { blockchain: Blockchain },
  withdrawTime?: dayjs.Dayjs,
) => {
  const now = dayjs()

  const purchaseTime = dayjs(node.createdAt)

  const lockTime = purchaseTime.add(node.blockchain.rewardLockTime ?? 0, "day")

  const ownership = paidCredit / node.blockchain.price

  if (now.isBefore(lockTime)) {
    return { reward: 0, ownership }
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
